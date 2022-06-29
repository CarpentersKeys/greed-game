import { HydratedDocument, UpdateAggregationStage, UpdateQuery } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import { CREATE_PLAYER, DELETE_PLAYER, GET_ALL_QUERY, STATE_QUERY, UPDATE_STATE, ASSIGN_ROLES } from "../../../lib/famousStrings";
import { validateTypeAndErrorIfFail } from "../../../lib/validateTypeAndErrorIfFail";
import { Player } from "../../../models/player/mongoose";
import { Game } from "../../../models/game/mongoose";
import { EGameRoles, IPlayer } from "../../../models/player/types";
import { isObjectId, isPlayer, TObjectId } from "../../../models/typeCheckers";

// endpoints for all player returning requests
// TODO: move getAll player into it's own route
export default async function (
    req: NextApiRequest,
    resp: NextApiResponse<
        IAPIBadResp
        | IPlayer
        | IPlayer[]
    >
) {
    await dbConnect();
    const { endPoint, id, postData } = JSON.parse(req.query.key[0])
    // load endpoint and response object to validation fn
    const pathBadResp = validateTypeAndErrorIfFail({ apiPath: 'player', resp });

    // TODO refactor to if into all endpoints that need id
    switch (endPoint) {
        // queries
        case STATE_QUERY:
            {
                const valueBadResp = pathBadResp({ endPoint: STATE_QUERY })
                if (valueBadResp({ evaluator: isObjectId, value: id })) { return; };
                const player =
                    await Player.findById(id);
                if (valueBadResp({ evaluator: isPlayer, value: player })) { return; };
                return resp.status(200).json(player);
            }
            break;

        case GET_ALL_QUERY:
            {
                const endPointBadResp = pathBadResp({ endPoint: GET_ALL_QUERY });
                const players =
                    await Player.find().sort({ updatedAt: -1 });
                if (endPointBadResp({
                    evaluator(players: unknown) {
                        if (!Array.isArray(players)) { return; };
                        return (players.every(p => isPlayer(p)))
                    },
                    value: players
                })) { return; };
                return resp.status(200).json(players);
            }
            break;

        // mutations
        case CREATE_PLAYER:
            {
                // load endpoint into validation function the validate player name
                const endPointPathBadResp = pathBadResp({ endPoint: CREATE_PLAYER });
                //TODO: make this more terse
                if (endPointPathBadResp({ evaluator: (p => !!p && typeof p === 'string'), value: postData })) { return; };
                const name = postData;
                const newPlayer: HydratedDocument<IPlayer> = new Player({ name });
                const savedPlayer = await newPlayer.save();
                if (endPointPathBadResp({ evaluator: isPlayer, value: savedPlayer })) { return; };
                return resp.status(200).json(savedPlayer);
            }
            break;

        case UPDATE_STATE:
            {
                const endPointPathBadResp = pathBadResp({ endPoint: UPDATE_STATE });
                if (endPointPathBadResp({ evaluator: isObjectId, value: id })) { return; };
                const update = postData;
                // this might break, check shape of update and what mdb expects
                const updateResp = await Player.updateOne({ _id: id }, update);
                if (endPointPathBadResp({ evaluator: isGoodPlayerUpdate, value: updateResp })) { return; };
                const updatedPlayer = await Player.findById(id);
                if (endPointPathBadResp({ evaluator: isPlayer, value: updatedPlayer })) { return; };
                return resp.status(200).json(updatedPlayer);
            }
            break;

        case ASSIGN_ROLES:
            {
                const valueErrorResp = pathBadResp({ endPoint: ASSIGN_ROLES })
                if (valueErrorResp({ evaluator: isObjectId, value: id })) { return; };
                const playerId = id;

                const game = await Game.findOne({ players: playerId })
                const playerIds = game?.players;
                const players = [];
                for (const pId of playerIds) {
                    const player = await Player.findById(pId);
                    if (player._id === playerId && player.gameRole) {
                        return resp.status(200).json(player);
                    }
                    players.push(player);
                }
                if (valueErrorResp({ evaluator: isTwoPlayers, value: players })) { return; };

                const randOrder = Math.floor(Math.random() + 1.5)
                const roles = Object.values(EGameRoles);
                const updatedPlayers = [];
                for (const i in players) {
                    const role = roles[(Number(i) + randOrder) % 2]
                    const updatedPlayer = await Player.findByIdAndUpdate(players[i]._id, { gameRole: role });
                    updatedPlayers.push(updatedPlayer);
                }
                if (valueErrorResp({ evaluator: isTwoPlayers, value: updatedPlayers })) { return; };

                const player = players.find(p => p._id === playerId);
                return resp.status(200).json(player);
            };
            break;

        case DELETE_PLAYER:
            {
                const valueErrorResp = pathBadResp({ endPoint: DELETE_PLAYER })
                if (valueErrorResp({ evaluator: isObjectId, value: id })) { return; };
                const deletedPlayer = await Player.findByIdAndDelete(id);
                if (valueErrorResp({ evaluator: '!', value: deletedPlayer })) { return; };
                return resp.status(200).json(deletedPlayer);
            };
            break;
        default:
            resp.status(405).end(`endPoint ${endPoint} Not Allowed`);
    }
};

function isGoodPlayerUpdate(updateResp: UpdateQuery<IPlayer>) {
    if (!updateResp?.acknowledged) { return false; };
    if (!(updateResp?.matchedCount === 1)) { return false; };
    return true;
}

function isTwoPlayers(arr: unknown[]) {
    if (arr.length !== 2) { return false; };
    if (!arr.every(p => isPlayer(p))) { return false; };
    return true;
}

export interface IAPIBadResp { errorMessage: string };
// queries
export interface IStateQueryAPIResp { [STATE_QUERY]: IPlayer };
export interface IGetAllQueryAPIRes { [GET_ALL_QUERY]: IPlayer[] };
// mutations
export interface ICreatePlayerAPIResp { [CREATE_PLAYER]: TObjectId };
export interface IUpdateStateAPIResp { [UPDATE_STATE]: TObjectId };
export interface IAssignRolesAPIResp { [ASSIGN_ROLES]: TObjectId[] };
export interface IDeletePlayerAPIResp { [DELETE_PLAYER]: TObjectId };