import { Schema, model, models } from "mongoose";

export interface IPlayer {
    name: string;
    autoMatch: Boolean;
}

export const playerSchema = new Schema({
    name: { type: String, required: true },
    autoMatch: { type: Boolean, required: true },
})

export default models.Player || model<IPlayer>('Player', playerSchema);