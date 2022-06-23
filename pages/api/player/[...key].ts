import { HydratedDocument, UpdateAggregationStage, UpdateQuery } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import { CREATE_PLAYER, DELETE_PLAYER, GET_ALL_QUERY, STATE_QUERY, UPDATE_STATE, ASSIGN_ROLES } from "../../../lib/famousStrings";
import { validateTypeAndErrorIfFail } from "../../../lib/validateTypeAndErrorIfFail";
import { Player } from "../../../models/player/mongoose";
import { EGameRoles, IPlayer } from "../../../models/player/types";
import { isObjectId, isPlayer, TObjectId } from "../../../models/typeCheckers";


export default async function (
    req: NextApiRequest,
    resp: NextApiResponse<
        IAPIBadResp
        // queries
        | IStateQueryAPIResp
        | IGetAllQueryAPIRes
        // mutations
        | ICreatePlayerAPIResp
        | IUpdateStateAPIResp
        | IAssignRolesAPIResp
        | IDeletePlayerAPIResp
    >
) {
    await dbConnect();
    const { endPoint, postData } = JSON.parse(req.query.key[0])
    // load endpoint and response object to validation fn
    const pathBadResp = validateTypeAndErrorIfFail({ apiPath: 'player', resp });

    switch (endPoint) {
        // queries
        case STATE_QUERY:
            {
                const valueBadResp = pathBadResp({ endPoint: STATE_QUERY })
                if (valueBadResp({ evaluator: isObjectId, value: postData })) { return; };
                const playerId = postData;
                const playerState =
                    await Player.findById(playerId);
                if (valueBadResp({ evaluator: isPlayer, value: playerState })) { return; };
                return resp.status(200).json({ [STATE_QUERY]: playerState });
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
                return resp.status(200).json({ [GET_ALL_QUERY]: players });
            }
            break;

        // mutations
        case CREATE_PLAYER:
            {
                // load endpoint into validation function the validate player name
                const endPointPathBadResp = pathBadResp({ endPoint: CREATE_PLAYER });
                if (endPointPathBadResp({ evaluator: (p => !!p && typeof p === 'string'), value: postData })) { return; };
                const name = postData;
                const newPlayer: HydratedDocument<IPlayer> = new Player({ name });
                const savedPlayer = await newPlayer.save();
                if (endPointPathBadResp({ evaluator: isObjectId, value: savedPlayer?._id })) { return; };
                return resp.status(200).json({ [CREATE_PLAYER]: savedPlayer._id });
            }
            break;

        case UPDATE_STATE:
            {
                const endPointPathBadResp = pathBadResp({ endPoint: UPDATE_STATE });
                if (endPointPathBadResp({ evaluator: isObjectId, value: postData._id })) { return; };
                const playerId = postData._id;
                const update = postData;
                const updateResp = await Player.updateOne({ _id: playerId }, update);
                if (endPointPathBadResp({ evaluator: isGoodPlayerUpdate, value: updateResp })) { return; };
                const updatedPlayer = await Player.findById(playerId);
                if (endPointPathBadResp({ evaluator: isPlayer, value: updatedPlayer })) { return; };
                return resp.status(200).json({ [UPDATE_STATE]: playerId });
            }
            break;

        case ASSIGN_ROLES:
            {
                const valueErrorResp = pathBadResp({ endPoint: ASSIGN_ROLES })
                if (valueErrorResp({ evaluator: isObjectId, value: postData })) { return; };
                const gameId = postData;
                const players = await Player.find({ inGame: gameId });
                if (valueErrorResp({ evaluator: isTwoPlayers, value: players })) { return; };
                const randOrder = Math.floor(Math.random() + 1.5)
                const roles = Object.values(EGameRoles);
                const updatedPlayers = [];
                for (const i in players) {
                    const role = roles[(Number(i) + randOrder) % 2]
                    console.log(role)
                    const updatedPlayer = await Player.findByIdAndUpdate(players[i]._id, { gameRole: role });
                    updatedPlayers.push(updatedPlayer);
                    console.log(updatedPlayer)
                }
                if (valueErrorResp({ evaluator: isTwoPlayers, value: updatedPlayers })) { return; };
                const updatedPlayerIds = updatedPlayers.map(p => p._id)
                return resp.status(200).json({ [ASSIGN_ROLES]: updatedPlayerIds });
            };
            break;

        case DELETE_PLAYER:
            {
                const valueErrorResp = pathBadResp({ endPoint: DELETE_PLAYER })
                if (valueErrorResp({ evaluator: isObjectId, value: postData })) { return; };
                const playerId = postData;
                const deletedPlayer = await Player.findByIdAndDelete(playerId);
                if (valueErrorResp({ evaluator: '!', value: deletedPlayer })) { return; };
                return resp.status(200).json({ [DELETE_PLAYER]: deletedPlayer._id });
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