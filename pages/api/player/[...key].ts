import { HydratedDocument, Query } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import { Player } from "../../../models/player/mongoose";
import { IPlayer } from "../../../models/player/types";

export default async function (req: NextApiRequest, resp: NextApiResponse) {
    await dbConnect();
    const { endPoint, postString } = JSON.parse(req.query.key[0])

    switch (endPoint) {
        case 'new':
            const newPlayer: HydratedDocument<IPlayer> = new Player({ name: postString});
            const savedPlayer = await newPlayer.save();
            if (savedPlayer) {
                return resp.status(200).json(newPlayer);
            } else {
                return resp.status(500);
            };
            break;
        case 'getState':
            const playerState =
                await Player.findById<Query<IPlayer, IPlayer>>(postString);

            if (isPlayer(playerState)) {
                return resp.status(200).json(playerState);
            } else {
                return resp.status(500).json('pls respond');
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