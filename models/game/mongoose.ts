import { Schema, model, models } from "mongoose";
import { roundResultSchema } from "../roundResult/mongoose";
import { IGame } from "./types";
import { ObjectId, TObjectId } from "../typeCheckers";


// REMEMBER TO RESTART SEVER IF YOU CHANGE THE SCHEMA
export const gameSchema: Schema = new Schema<IGame>({
    name: String,
    players: {
        type: [ObjectId],
        required: true,
        validate: (players: TObjectId[]) => players.length <= 2,
    },
    isOpen: { type: Boolean, default: true, required: true },
    type: { type: String, default: 'Game', immutable: true, required: true },
    //TODO: autoMatch: 
    // roundResults: [roundResultSchema],
    //TODO: ENUM  to types of game stage
    gameStage: { type: String, default: 'matching', required: true },
}, {
    timestamps: true,
});

export const Game = (models?.Game || model<IGame>('Game', gameSchema)) /*as IGameModel*/;