import { models, model, Schema } from "mongoose";
import { playerSchema } from '../player/mongoose'
import { IStartRoundStageResult, ISetTimerStageResult, IRunTimerStageResult, IWinRoundStageResult } from './types'

export const startRoundStageResultSchema = new Schema({
    players: [{ type: playerSchema, }],
})

export const setTimerStageResultSchema = new Schema({
    players: [{ type: playerSchema, }],
    timerSet: Number,
})

export const runTimerStageResultSchema = new Schema({
    players: [{ type: playerSchema, }],
    timeRan: Number,
})

export const winRoundStageResultSchema = new Schema({
    score: Number,
    winner: { type: playerSchema },
    loser: { type: playerSchema },
})

const startRoundStageResult = models?.startRoundStageResult || model<IStartRoundStageResult>('startRoundStageResult', startRoundStageResultSchema);
const setTimerStageResult = models?.setTimerStageResult || model<ISetTimerStageResult>('setTimerStageResult', setTimerStageResultSchema);
const runTimerStageResult = models?.runTimerStageResult || model<IRunTimerStageResult>('runTimerStageResult', runTimerStageResultSchema);
const winRoundStageResult = models?.winRoundStageResult || model<IWinRoundStageResult>('winRoundStageResult', winRoundStageResultSchema);

export { startRoundStageResult, setTimerStageResult, runTimerStageResult, winRoundStageResult, }