import { IPlayer } from "../player/types";
import { IStartRoundStageResult, ISetTimerStageResult, IRunTimerStageResult, IWinRoundStageResult } from "../stageResults/types";
import { TObjectId } from "../typeCheckers";

export default interface IRoundResult {
    type: string;
    winner: IPlayer;
    loser: IPlayer;
    score: number;
    stageResults: {
        startRoundStage: IStartRoundStageResult;
        setTimerStage: ISetTimerStageResult;
        runTimerStage: IRunTimerStageResult;
        winRoundStage: IWinRoundStageResult;
    };
    _id?: TObjectId;
    _createdAt?: Date;
    _updatedAt?: Date;
};