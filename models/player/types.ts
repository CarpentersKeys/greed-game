import { Types, ObjectId } from "mongoose";

export enum gameRole {
    TimerPlayer = 'timerPlayer',
    GreedyPlayer = 'greedyPlayer',
}

export interface IPlayer {
    name: string;
    gameRole?: string;
    // gameRole?: gameRole;
    _id?: ObjectId;
};

export interface IPlayerModel {
    new(obj: IPlayer): IPlayer;
}

export function isPlayer(obj: any): obj is IPlayer {
    if (!obj) { return false };
    return '_id' in obj && 'name' in obj;
}