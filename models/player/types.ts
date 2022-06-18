import mongoose from "mongoose";
import { TObjectId } from "../typeCheckers";


export enum gameRole {
    TimerPlayer = 'timerPlayer',
    GreedyPlayer = 'greedyPlayer',
}

export interface IPlayer extends mongoose.Types.Subdocument {
    name: string;
    inGame: boolean;
    type: string;
    gameRole?: gameRole;
    _id?: TObjectId;
    score?: number;
};
