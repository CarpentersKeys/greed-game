import dbConnect from "../../../lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import { HydratedDocument } from "mongoose";
import { IPlayer } from "../../../models/player/types";
import { Player } from "../../../models/player/mongoose";

export default async function (req: NextApiRequest, resp: NextApiResponse) {
  await dbConnect();

  const {
    body: { name },
    method,
  } = req

  if (method !== 'POST') { return; };

  const newPlayer: HydratedDocument<IPlayer> = new Player({ name })
  const savedPlayer = await newPlayer.save();
  if (savedPlayer) {
    return resp.status(200).json(newPlayer);
  } else {
    return resp.status(500);
  }

}