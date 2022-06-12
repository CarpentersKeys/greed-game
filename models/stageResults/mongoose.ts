import { models, model, Schema } from "mongoose";
import Player from '../player/mongoose'
import { IStartRoundStageResult, ISetTimerStageResult, IRunTimerStageResult, IWinRoundStageResult } from './types'

const startRoundStageResultSchema = new Schema({
    players: [Player],
})

const setTimerStageResultSchema = new Schema({
    players: [Player],
    timerSet: Number,
})

const runTimerStageResultSchema = new Schema({
    players: [Player],
    timeRan: Number,
})

const winRoundStageResultSchema = new Schema({
    score: Number,
    winner: Player,
    loser: Player,
})

const startRoundStageResult = models.startRoundStageResult || model<IStartRoundStageResult>('startRoundStageResult', startRoundStageResultSchema);
const setTimerStageResult = models.setTimerStageResult || model<ISetTimerStageResult>('setTimerStageResult', setTimerStageResultSchema);
const runTimerStageResult = models.runTimerStageResult || model<IRunTimerStageResult>('runTimerStageResult', runTimerStageResultSchema);
const winRoundStageResult = models.winRoundStageResult || model<IWinRoundStageResult>('WinRoundStageResult', winRoundStageResultSchema);

export { startRoundStageResult, setTimerStageResult, runTimerStageResult, winRoundStageResult, }