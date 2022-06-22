import { Query } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import { validateTypeAndErrorIfFail } from "../../../lib/validateTypeAndErrorIfFail";
import { Game } from "../../../models/game/mongoose";
import { IGame } from "../../../models/game/types";
import { isGame, isObjectId, ObjectId } from "../../../models/typeCheckers";
import { TObjectId } from "../../../models/typeCheckers";
import { STATE_QUERY, REMOVE_PLAYER_FROM_GAME, JOIN_OR_CREATE_GAME, GET_ALL_QUERY } from "../../../lib/famousStrings";
import { playerSchema } from "../../../models/player/mongoose";
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
        | { [JOIN_OR_CREATE_GAME]: TObjectId }
        | { [REMOVE_PLAYER_FROM_GAME]: { updatedGameIds: TObjectId[], deletedGames: object } }
    >
) {
    await dbConnect();
    const { endPoint, postData } = JSON.parse(req.query.id[0])
    const pathBadResp = validateTypeAndErrorIfFail({ apiPath: 'game', resp });

    switch (endPoint) {
        // queries
        case STATE_QUERY:
            {
                const endPointErrorResp = pathBadResp({ endPoint: STATE_QUERY });
                if (endPointErrorResp({ evaluator: isObjectId, value: postData })) { return; };
                const gameId = postData;
                const gameState =
                    await Game.findById(gameId);
                if (endPointErrorResp({ evaluator: isGame, value: gameState })) {
                    return;
                };
                return resp.status(200).json({ [STATE_QUERY]: gameState });
            }
            break;

        case GET_ALL_QUERY:
            {
                const endPointErrorResp = pathBadResp({ endPoint: GET_ALL_QUERY });
                const games =
                    await Game.find().sort({ updatedAt: -1 });

                if (endPointErrorResp({
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
                const endPointErrorResp = pathBadResp({ endPoint: JOIN_OR_CREATE_GAME });
                if (endPointErrorResp({ evaluator: isObjectId, value: postData })) { return; };
                const playerId = postData;
                // check for open game
                const openGame = await findOpenGame(); // defined below
                const closedGame = openGame
                    ? playerGameAction(playerId, openGame, EPlayerGameAction.JOIN)
                    : new Game({ players: [playerId], isOpen: true });
                const savedGame = await closedGame.save();
                if (endPointErrorResp({ evaluator: isObjectId, value: savedGame._id })) { return; };
                return resp.status(200).json({ [JOIN_OR_CREATE_GAME]: savedGame._id });
            }
            break;

        case REMOVE_PLAYER_FROM_GAME:
            if (pathBadResp({ evaluator: isObjectId, value: postData, endPoint: JOIN_OR_CREATE_GAME })) { return; };
            const playerId = postData;
            // remove player from all games
            // TODO end sesesion doesn't removed playes from array
            const games = await Game.find({ players: { $in: playerId } });
            const updatedGameIds = [];
            for (const g of games) {
                const updated = await playerGameAction(playerId, g, EPlayerGameAction.REMOVE).save();
                updatedGameIds.push(updated._id);
            }
            const deletedGames = await Game.deleteMany({
                $or: [
                    { $expr: { $lt: [{ $size: '$players' }, 1], } },
                    { $exists: 'players.2' }
                ]
            })
            console.log(deletedGames);
            return resp.status(200).json({ [REMOVE_PLAYER_FROM_GAME]: { updatedGameIds, deletedGames } });
            break;

        default:
            resp.setHeader('Allow', ['GET', 'PUT']);
            resp.status(405).end(`endPoint ${endPoint} Not Allowed`);
    };
};

async function findOpenGame(attempt = 0): Promise<IGame | null> {
    if (attempt > 3) { throw new Error('there\s a problem finding an open game, check database') }
    const openGame: IGame | null =
        await Game
            .findOne<Query<IGame, IGame>>({ isOpen: true })

    // no game avail, make one
    if (!openGame) { return null }

    const isValid = openGame.players
        // TODO: standardized isPlayer()
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