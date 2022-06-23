import { Schema, model, models, Model } from "mongoose";
import { ObjectId } from "../typeCheckers";
import { IPlayer } from "./types";

// REMEMBER TO RESTART SEVER IF YOU CHANGE THE SCHEMA
export const playerSchema = new Schema<IPlayer/*, Model<IPlayer>*/>({
    // IDEA: make unrequired so players can just smash automatch and go into a game(choose name at the end for record)
    name: { type: String, required: true },
    inGame: { type: ObjectId },
    type: { type: String, default: 'Player', immutable: true, required: true },
    gameRole: String,
    score: Number,
}, { timestamps: true });

export const Player = (models?.Player || model<IPlayer>('Player', playerSchema)) /*as IPlayerModel*/;