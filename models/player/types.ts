import { Types } from "mongoose";
import { IGame } from "../game/types";

export enum gameRole {
    TimerPlayer = 'timerPlayer',
    GreedyPlayer = 'greedyPlayer',
}

export interface IPlayer {
    name: string;
    gameRole?: gameRole;
    game?: IGame;
    _id?: Types.ObjectId;
};
