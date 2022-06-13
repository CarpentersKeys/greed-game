import { Schema, model, models } from "mongoose";
import { Player, playerSchema } from "../player/mongoose";
import { roundResultSchema } from "../roundResult/mongoose";
import { IGameModel } from "./types";

export const gameSchema: Schema = new Schema({
    players: { type: [playerSchema], required: true },
    //TODO: autoMatch: 
    roundResults: { type: [roundResultSchema], required: false },
    gameStage: String,
}, { timestamps: true, });

export const Game = (models?.Game || model('Game', gameSchema)) as IGameModel;