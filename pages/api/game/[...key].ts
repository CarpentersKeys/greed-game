import { Query } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import { validateTypeAndErrorIfFail } from "../../../lib/validateTypeAndErrorIfFail";
import { Game } from "../../../models/game/mongoose";
import { IGame } from "../../../models/game/types";
import { isGame, isGameRole, isObjectId, isPlayer } from "../../../models/typeCheckers";
import { TObjectId } from "../../../models/typeCheckers";
import { STATE_QUERY, REMOVE_PLAYER_FROM_GAME, JOIN_OR_CREATE_GAME, GET_ALL_QUERY, UPDATE_STATE } from "../../../lib/famousStrings";
import { Player } from "../../../models/player/mongoose";
import { IAPIBadResp, isGoodUpdate } from "../player/[...key]";
import { EGameRoles } from "../../../models/player/types";

export default async function apiGameEndpoints(
    req: NextApiRequest,
    resp: NextApiResponse<
        IAPIBadResp
        | IGame
        | IGame[]
    >
) {
    await dbConnect();
    const { endPoint, id, postData } = JSON.parse(req.query.key[0])
    const pathBadResp = validateTypeAndErrorIfFail({ apiPath: 'game', resp });

    switch (endPoint) {
        // queries
        case STATE_QUERY:
            {
                const endPointBadResp = pathBadResp({ endPoint: STATE_QUERY });
                if (endPointBadResp({ evaluator: isObjectId, value: id })) { return; };
                // if no gameRole we aren't in a game yet, so don't perform this check
                if (postData && endPointBadResp({ evaluator: isGameRole, value: postData })) { return; };
                const gameId = id;
                const isGreedy = postData === EGameRoles.GREEDY_PLAYER;
                const game = await Game.findById(gameId);
                if (endPointBadResp({ evaluator: isGame, value: game })) { return; };
                // don't include the timer value in greedyPlayers' gameState (no cheating!)
                if (isGreedy) { delete game.timeSet };
                return resp.status(200).json(game);
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
                return resp.status(200).json(games);
            }
        // mutations
        case JOIN_OR_CREATE_GAME:
            {
                const endPointBadResp = pathBadResp({ endPoint: JOIN_OR_CREATE_GAME });
                if (endPointBadResp({ evaluator: isObjectId, value: id })) { return; };
                // check for open game
                const openGame = await findOpenGame(); // defined below
                const closedGame = openGame
                    ? playerGameAction(id, openGame, EPlayerGameAction.JOIN)
                    : new Game({ players: [id], isOpen: true });
                const savedGame = await closedGame.save();
                if (endPointBadResp({ evaluator: isGame, value: savedGame })) { return; };
                // update players inGame field
                const updatedPlayer = await Player.findByIdAndUpdate(id, { inGame: savedGame._id })
                if (endPointBadResp({ evaluator: isPlayer, value: updatedPlayer })) { return; };
                return resp.status(200).json(savedGame);
            }
            break;

        case UPDATE_STATE:
            {
                const endPointPathBadResp = pathBadResp({ endPoint: UPDATE_STATE });
                if (endPointPathBadResp({ evaluator: isObjectId, value: id })) { return; };
                const update = postData;
                const gameId = id;
                // this might break, check shape of update and what mdb expects
                const updateResp = await Game.updateOne({ _id: gameId}, update);
                if (endPointPathBadResp<IGame>({ evaluator: isGoodUpdate, value: updateResp })) { return; };
                const updatedGame= await Game.findById(id);
                if (endPointPathBadResp<IGame>({ evaluator: isGame, value: updatedGame})) { return; };
                return resp.status(200).json(updatedGame);
            }
            break;

        case REMOVE_PLAYER_FROM_GAME:
            const endPointBadResp = pathBadResp({ endPoint: REMOVE_PLAYER_FROM_GAME });
            if (endPointBadResp({ evaluator: isObjectId, value: id })) { return; };
            const playerId = id;
            // remove player from all games
            const games = await Game.find({ players: { $in: playerId } });
            const updatedGames = [];
            const deletedGames = [];

            for (const g of games) {
                const updated = await playerGameAction(playerId, g, EPlayerGameAction.REMOVE).save();
                if (endPointBadResp({ evaluator: '!', value: updated })) { return; };
                updatedGames.push(g);
                const pLength = g.players.length;
                const isValid = pLength === 1 || pLength === 2
                if (!isValid) {
                    const deleted = await Game.findByIdAndDelete(g._id);
                    if (endPointBadResp({ evaluator: '!', value: deleted })) { return; };
                    deletedGames.push(g);
                }
            }
            if (games.length > 1) {
                console.error(`Player of id: ${playerId} was removed from more than one game. ${JSON.stringify({ games })}`)
            }
            return resp.status(200).json(games[0]);
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