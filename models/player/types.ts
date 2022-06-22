import mongoose from "mongoose";
import { TObjectId } from "../typeCheckers";


export enum gameRole {
    TimerPlayer = 'timerPlayer',
    GreedyPlayer = 'greedyPlayer',
}

export interface IPlayer extends mongoose.Types.Subdocument {
    _id: TObjectId;
    name: string;
    inGame: boolean;
    type: string;
    gameRole?: gameRole;
    score?: number;
};

export interface IPlayerUpdate {
    _id: TObjectId;
    name?: string;
    inGame?: boolean;
    type?: string;
    gameRole?: gameRole;
    score?: number;
};