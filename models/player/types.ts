import mongoose from "mongoose";
import { TObjectId } from "../typeCheckers";


export enum EGameRoles {
    TIMER_PLAYER = 'timerPlayer',
    GREEDY_PLAYER = 'greedyPlayer',
}

export interface IPlayer extends mongoose.Types.Subdocument {
    _id: TObjectId;
    name: string;
    inGame: undefined | TObjectId;
    type: string;
    gameRole?: EGameRoles;
    score?: number;
};

export interface IPlayerUpdate {
    _id: TObjectId;
    name?: string;
    inGame?: undefined| TObjectId;
    type?: string;
    gameRole?: EGameRoles;
    score?: number;
};