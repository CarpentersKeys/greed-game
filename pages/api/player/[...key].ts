import { HydratedDocument, Query, Schema } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import { CREATE_PLAYER, DELETE_PLAYER, GET_ALL_QUERY, STATE_QUERY } from "../../../lib/famousStrings";
import { validateTypeAndErrorIfFail } from "../../../lib/validateTypeAndErrorIfFail";
import { Player } from "../../../models/player/mongoose";
import { IPlayer } from "../../../models/player/types";
import { isObjectId, isPlayer, TObjectId } from "../../../models/typeCheckers";

export default async function (
    req: NextApiRequest,
    resp: NextApiResponse<
        { errorMessage: string }
        | { [STATE_QUERY]: IPlayer }
        | { [GET_ALL_QUERY]: IPlayer[] }
        | { [CREATE_PLAYER]: TObjectId }
        | { [DELETE_PLAYER]: TObjectId }
    >
) {
    await dbConnect();
    const { endPoint, postData } = JSON.parse(req.query.key[0])
    // load endpoint and response object to validation fn
    const pathBadResp = validateTypeAndErrorIfFail({ apiPath: 'player', resp });

    switch (endPoint) {
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

        case DELETE_PLAYER:
            {
                const valueErrorResp = pathBadResp({ endPoint: DELETE_PLAYER })
                if (valueErrorResp({ evaluator: isObjectId, value: postData })) { return; };
                const playerId = postData;


                //remove player from db
                const deletedPlayer = await Player.findByIdAndDelete(playerId);
                if (valueErrorResp({ evaluator: '!', value: deletedPlayer })) { return; };
                return resp.status(200).json({ [DELETE_PLAYER]: deletedPlayer._id });
            };
            break;
        default:
            resp.status(405).end(`endPoint ${endPoint} Not Allowed`);
    }
};
