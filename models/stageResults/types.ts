import { IPlayer } from "../player/types";
/**
 *  the challenge was accepted and the round started
 *  return players array with gameRole properties added to each player object
 * @interface IStartRoundStageResult {Object} expected return of @link {startRoundStageResult}
 */
export interface IStartRoundStageResult {
    type: string;
    /** two player objects, one greedy, one timer*/
    players: [IPlayer, IPlayer]
}
/**
 * the timerPlayer is prompted to input a time setting
 * returns a promise that resolves when time input in ms
 * @interface ISetTimerStageResult {Object} expected return of @link {setTimerStageResult}
 */
export interface ISetTimerStageResult {
    type: string;
    /** two player objects, one greedy, one timer*/
    players: [IPlayer, IPlayer]
    /** time in ms */
    timerSet: number
}

/**
 *  the timer begins to run and greedyPlayer is prompted to 'cash in'
 *  returns a promise that resolves to the time the greedy player cashed in
 * @interface IRunTimerStageResult {Object} expected return of @link {runTimerStageResult}
 */
export interface IRunTimerStageResult {
    type: string;
    /** two player objects, one greedy, one timer*/
    players: [IPlayer, IPlayer]
    /** elapsed time in ms */
    timeRan: number
}

/**
 * the score is computed and the winner decided
 * returns the round result object to be merged into the gameState
 * @interface IWinRoundStageResult {Object} expected return of @link {winRoundStageResult}
 */
export interface IWinRoundStageResult {
    type: string;
    /** two player objects, one greedy, one timer*/
    score: number;
    winner: IPlayer;
    loser: IPlayer;
}