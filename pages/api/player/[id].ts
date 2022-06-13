import { HydratedDocument, Query } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import { Player } from "../../../models/player/mongoose";
import { IPlayer, isPlayer } from "../../../models/player/types";

export default async function (req: NextApiRequest, resp: NextApiResponse) {
    await dbConnect();

    const {
        query: { id },
        method,
    } = req

    switch (method) {
        case 'GET':
            const playerState =
                await Player.findById<Query<IPlayer, IPlayer>>(id)

            if (isPlayer(playerState)) { return resp.status(200).json(playerState); } else {
                return resp.status(500).json('pls respond');
            };
            break
        default:
            resp.setHeader('Allow', ['GET', 'PUT'])
            resp.status(405).end(`Method ${method} Not Allowed`)
    }
}