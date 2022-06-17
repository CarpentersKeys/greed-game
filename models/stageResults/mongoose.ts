import { models, model, Schema } from "mongoose";
import { playerSchema } from '../player/mongoose'
import { IStartRoundStageResult, ISetTimerStageResult, IRunTimerStageResult, IWinRoundStageResult } from './types'

// REMEMBER TO RESTART SEVER IF YOU CHANGE THE SCHEMA
export const startRoundStageResultSchema = new Schema({
    players: [{ type: playerSchema, }],
    type: {type: String, default: 'StartRoundStageResult', immutable: true},
})

export const setTimerStageResultSchema = new Schema({
    players: [{ type: playerSchema, }],
    timerSet: Number,
    type: {type: String, default: 'SetTimerStageResult', immutable: true},
})

export const runTimerStageResultSchema = new Schema({
    players: [{ type: playerSchema, }],
    timeRan: Number,
    type: {type: String, default: 'RunTimerStageResult', immutable: true},
})

export const winRoundStageResultSchema = new Schema({
    score: Number,
    winner: { type: playerSchema },
    loser: { type: playerSchema },
    type: {type: String, default: 'WinRoundStageResult', immutable: true},
})

const startRoundStageResult = models?.startRoundStageResult || model<IStartRoundStageResult>('startRoundStageResult', startRoundStageResultSchema);
const setTimerStageResult = models?.setTimerStageResult || model<ISetTimerStageResult>('setTimerStageResult', setTimerStageResultSchema);
const runTimerStageResult = models?.runTimerStageResult || model<IRunTimerStageResult>('runTimerStageResult', runTimerStageResultSchema);
const winRoundStageResult = models?.winRoundStageResult || model<IWinRoundStageResult>('winRoundStageResult', winRoundStageResultSchema);

export { startRoundStageResult, setTimerStageResult, runTimerStageResult, winRoundStageResult, }