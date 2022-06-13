import { Schema, model, models } from "mongoose";
import { Player, playerSchema } from "../player/mongoose";
import IRoundResult from "./types";
import { startRoundStageResultSchema, setTimerStageResultSchema, runTimerStageResultSchema, winRoundStageResultSchema, } from '../stageResults/mongoose'

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
}, { timestamps: true, });

export default models?.RoundResult || model<IRoundResult>('RoundResult', roundResultSchema);