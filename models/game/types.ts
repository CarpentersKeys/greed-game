import mongoose from 'mongoose';
import IRoundResult from "../roundResult/types";
import { TObjectId } from "../typeCheckers";

export enum EJoinedOrCreated {
    GAME_JOINED = 'gameJoined',
    GAME_CREATED = 'gameCreated',
}

export interface IGame extends mongoose.Types.Subdocument {
    //TODO: autoMatch:
    _id: TObjectId;
    players: TObjectId[];
    type: string;
    isOpen: boolean;
    gameStage: string;
    // roundResults?: IRoundResult[];
    _createdAt?: Date;
    _updatedAt?: Date;
    name?: string;
    // temp
    score?: {
        // not ideal but I guess I'll toString object Id for now
        [name: string]: { id: TObjectId, score: number }
    }
    timeSet: number;
    timeRan: number;
};

export enum EGameStage {
    MATCHING = 'matching',
    TIMER_SET = 'timerSet',
    TIMER_RUN = 'timerRun',
    ROUND_CONCLUDE = 'roundConclude',
}