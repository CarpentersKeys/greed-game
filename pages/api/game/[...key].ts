import { Query } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import { validateTypeAndErrorIfFail } from "../../../lib/validateTypeAndErrorIfFail";
import { Game } from "../../../models/game/mongoose";
import { IGame } from "../../../models/game/types";
import { isGame, isObjectId, isPlayer, ObjectId } from "../../../models/typeCheckers";
import { TObjectId } from "../../../models/typeCheckers";
import { STATE_QUERY, REMOVE_PLAYER_FROM_GAME, JOIN_OR_CREATE_GAME, GET_ALL_QUERY } from "../../../lib/famousStrings";
import { EJoinedOrCreated } from "../../../models/game/types";
import { Player } from "../../../models/player/mongoose";
//TODO method to prevent simultaneous joins resulting in more than 2 players in the game
//TODO when ending session kill all open games
export default async function (
    req: NextApiRequest,
    resp: NextApiResponse<
        { errorMessage: string }
        // useQuery resps
        | { [STATE_QUERY]: IGame }
        | { [GET_ALL_QUERY]: IGame[] }
        // useMutateGame resps
        | { [JOIN_OR_CREATE_GAME]: { [EJoinedOrCreated.GAME_CREATED]?: TObjectId, [EJoinedOrCreated.GAME_JOINED]?: TObjectId } }
        | { [REMOVE_PLAYER_FROM_GAME]: { updatedGameIds: TObjectId[], deletedGameIds: TObjectId[] } }
    >
) {
    await dbConnect();
    const { endPoint, postData } = JSON.parse(req.query.key[0])
    const pathBadResp = validateTypeAndErrorIfFail({ apiPath: 'game', resp });

    switch (endPoint) {
        // queries
        case STATE_QUERY:
            {
                const endPointBadResp = pathBadResp({ endPoint: STATE_QUERY });
                if (endPointBadResp({ evaluator: isObjectId, value: postData })) { return; };
                const gameId = postData;
                const gameState =
                    await Game.findById(gameId);
                if (endPointBadResp({ evaluator: isGame, value: gameState })) {
                    return;
                };
                return resp.status(200).json({ [STATE_QUERY]: gameState });
            }
            break;

        case GET_ALL_QUERY:
            {
                const endPointBadResp = pathBadResp({ endPoint: GET_ALL_QUERY });
                const games =
                    await Game.find().sort({ updatedAt: -1 });

                if (endPointBadResp({
                    evaluator(games: unknown) {
                        if (!Array.isArray(games)) { return; };
                        return (games.every(g => isGame(g)))
                    },
                    value: games
                })) { return; };
                return resp.status(200).json({ [GET_ALL_QUERY]: games });
            }
        // mutations
        case JOIN_OR_CREATE_GAME:
            {
                console.log(postData)
                const endPointBadResp = pathBadResp({ endPoint: JOIN_OR_CREATE_GAME });
                if (endPointBadResp({ evaluator: isObjectId, value: postData })) { return; };
                const playerId = postData;
                // check for open game
                const openGame = await findOpenGame(); // defined below
                const closedGame = openGame
                    ? playerGameAction(playerId, openGame, EPlayerGameAction.JOIN)
                    : new Game({ players: [playerId], isOpen: true });
                const savedGame = await closedGame.save();
                const joinedOrCreated = openGame ? EJoinedOrCreated.GAME_JOINED : EJoinedOrCreated.GAME_CREATED;
                if (endPointBadResp({ evaluator: isObjectId, value: savedGame._id })) { return; };
                // update players inGame field
                const updatedPlayer = await Player.findByIdAndUpdate(playerId, { inGame: savedGame._id })
                if (endPointBadResp({ evaluator: isPlayer, value: updatedPlayer })) { return; };
                return resp.status(200).json({ [JOIN_OR_CREATE_GAME]: { [joinedOrCreated]: savedGame._id } });
            }
            break;

        case REMOVE_PLAYER_FROM_GAME:
            const endPointBadResp = pathBadResp({ endPoint: REMOVE_PLAYER_FROM_GAME });
            if (endPointBadResp({ evaluator: isObjectId, value: postData })) { return; };
            const playerId = postData;
            // remove player from all games
            const games = await Game.find({ players: { $in: playerId } });
            const updatedGameIds = [];
            const deletedGameIds = [];
            for (const g of games) {
                const updated = await playerGameAction(playerId, g, EPlayerGameAction.REMOVE).save();
                if (endPointBadResp({ evaluator: '!', value: updated })) { return; };
                updatedGameIds.push(g._id);
                const pLength = g.players.length;
                const isValid = pLength === 1 || pLength === 2
                if (!isValid) {
                    const deleted = await Game.findByIdAndDelete(g._id);
                    if (endPointBadResp({ evaluator: '!', value: deleted })) { return; };
                    deletedGameIds.push(g._id);
                }
            }
            return resp.status(200).json({ [REMOVE_PLAYER_FROM_GAME]: { updatedGameIds, deletedGameIds } });
            break;

        default:
            resp.setHeader('Allow', ['GET', 'PUT']);
            resp.status(405).end(`endPoint ${endPoint} Not Allowed`);
    };
};

async function findOpenGame(attempt = 0): Promise<IGame | null> {
    if (attempt > 3) { throw new Error('there\s a problem finding an open game, check database') }
    const openGame: IGame | null =
        await Game.findOne<Query<IGame, IGame>>({ isOpen: true })
    if (!openGame) { return null }
    const isValid = openGame.players
        .filter(playerId => isObjectId(playerId))
        .length === 1;
    if (!isValid) {
        // questionable deletion?
        const invalidGame = await openGame.delete();
        return findOpenGame(attempt + 1);
    }
    return openGame;
}

enum EPlayerGameAction { JOIN = 'join', REMOVE = 'remove', }
function playerGameAction(playerId: TObjectId, openGame: IGame, action: EPlayerGameAction) {
    const update = openGame
    if (action === EPlayerGameAction.JOIN) {
        update.players.push(playerId)
    } else if (action === EPlayerGameAction.REMOVE) {
        update.players = update.players.filter(p => String(p) !== String(playerId))
    }
    update.isOpen = update.players.length < 2;
    return Object.assign(openGame, update);
}