import { HydratedDocument } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import { Game } from "../../models/game/mongoose";
import { IGame } from "../../models/game/types";

export default async function (req: NextApiRequest, resp: NextApiResponse) {
    // await dbConnect();

    // const newGame: HydratedDocument<IGame> = new Game({[]});
    // await newGame.save()
    // if (newGame) { return resp.status(200).json(newGame); } else {
    //     return resp.status(500);
    // };
}