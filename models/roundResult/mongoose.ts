import { Schema, model, models } from "mongoose";
import Player from "../player/mongoose";
import IRoundResult from "./types";
import { startRoundStageResult, setTimerStageResult, runTimerStageResult, winRoundStageResult, } from '../stageResults/mongoose'

export const roundResultSchema: Schema = new Schema({
    winner: { type: Player, required: true },
    loser: { type: Player, required: true },
    score: { type: Number, required: true },
    stageResults: {
        startRoundStage: startRoundStageResult,
        setTimerStage: setTimerStageResult,
        runTimerStage: runTimerStageResult,
        winRoundStage: winRoundStageResult,
    },
}, { timestamps: true, });

export default models.RoundResult || model<IRoundResult>('RoundResult', roundResultSchema);