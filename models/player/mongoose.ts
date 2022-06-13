import { Schema, model, models, Model } from "mongoose";
import { IPlayer } from "./types";

export const playerSchema = new Schema<IPlayer/*, Model<IPlayer>*/>({
    // IDEA: make unrequired so players can just smash automatch and go into a game(choose name at the end for record)
    name: { type: String, required: true },    
    gameRole: {type: String, required: false},
}, { timestamps: true });

export const Player = (models?.Player || model<IPlayer>('Player', playerSchema)) /*as IPlayerModel*/;