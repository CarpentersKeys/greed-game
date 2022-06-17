import { Schema, model, models } from "mongoose";
import { Player, playerSchema } from "../player/mongoose";
import IRoundResult from "./types";
import { startRoundStageResultSchema, setTimerStageResultSchema, runTimerStageResultSchema, winRoundStageResultSchema, } from '../stageResults/mongoose'

// REMEMBER TO RESTART SEVER IF YOU CHANGE THE SCHEMA
export const roundResultSchema: Schema = new Schema({
    winner: { type: playerSchema, required: true },
    loser: { type: playerSchema, required: true },
    score: { type: Number, required: true },
    stageResults: {
        startRoundStage: startRoundStageResultSchema,
        setTimerStage: setTimerStageResultSchema,
        runTimerStage: runTimerStageResultSchema,
        winRoundStage: winRoundStageResultSchema,
    },
    type: {type: String, default: 'RoundResult', immutable: true},
}, { timestamps: true, });

export default models?.RoundResult || model<IRoundResult>('RoundResult', roundResultSchema);