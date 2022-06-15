import { ObjectId } from "mongoose";

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


export function narrowToPlayer(sth: unknown): IPlayer {
    if (sth === null || typeof sth !== 'object') {
        throw new Error(`something that was supposed to be a player isn\'t: ${sth}`);
    };
    if ('name' in sth) {
        return sth as IPlayer;
    }
    throw new Error('must give postFetch an IPostOBj via useQuery');
}