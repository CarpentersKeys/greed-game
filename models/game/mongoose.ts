import { Schema, model, models } from "mongoose";
import Player from "../player/mongoose";
import RoundResult from "../roundResult/mongoose";
import { IGame } from "./types";

export const gameSchema: Schema = new Schema({
    players: { type: [Player], required: true },
    //TODO: autoMatch: 
    roundResults: { type: [RoundResult], required: true},
    gameStage: String,
}, { timestamps: true, });

export default models.Game || model<IGame>('Game', gameSchema);