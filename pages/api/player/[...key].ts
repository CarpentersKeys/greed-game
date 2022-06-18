import { HydratedDocument, Query, Schema } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import { Game } from "../../../models/game/mongoose";
import { Player } from "../../../models/player/mongoose";
import { IPlayer } from "../../../models/player/types";
import { isObjectId } from "../../../models/typeCheckers";

export default async function (req: NextApiRequest, resp: NextApiResponse) {
    await dbConnect();
    const { endPoint, postData } = JSON.parse(req.query.key[0])

    switch (endPoint) {
        case 'new':
            const newPlayer: HydratedDocument<IPlayer> = new Player({ name: postData});
            const savedPlayer = await newPlayer.save();
            if (savedPlayer) {
                return resp.status(200).json(newPlayer._id);
            } else {
                return resp.status(500).send(`from /api/player case: 'new'\nraw value of newPlayer._id ${newPlayer._id}`);
            };
            break;
        case 'getState':
            const playerState =
                await Player.findById<Query<IPlayer, IPlayer>>(postData);

            if (isPlayer(playerState)) {
                return resp.status(200).json(playerState);
            } else {
                return resp.status(500).send(`from /api/player case: 'getState'\nraw value of playerState: ${playerState}`);
            };
            break;
        default:
            resp.setHeader('Allow', ['GET', 'PUT']);
            resp.status(405).end(`endPoint ${endPoint} Not Allowed`);
    };
};

// TODO: fix this embarassing mess
function isPlayer(obj: any): boolean {
    if (!obj) {
        console.error('isPlayer, nithnig here ')
        return false
    };

    if (!('_id' in obj)) {
        console.error('isPlayer, no _id ')
        return false
    };
    if (!('name' in obj)) {
        console.error('isPlayer, no name ')
        return false
    };
    if (!('createdAt' in obj)) {
        console.error('isPlayer, no created ')
        return false
    };
    if (!('updatedAt' in obj)) {
        console.error('isPlayer, no updated')
        return false
    };
    return true;
}