import { HydratedDocument } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import Player from "../../models/player/mongoose";
import { IPlayer } from "../../models/player/types";

export default async function (req: NextApiRequest, resp: NextApiResponse) {
    await dbConnect();

    const newPlayer: HydratedDocument<IPlayer> = await new Player(req.body).save();
    if (newPlayer) { return resp.status(200).json(newPlayer); } else {
        return resp.status(500);
    };
}