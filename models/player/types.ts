import mongoose, { ObjectId } from "mongoose";

export enum gameRole {
    TimerPlayer = 'timerPlayer',
    GreedyPlayer = 'greedyPlayer',
}

export interface IPlayer extends mongoose.Types.Subdocument {
    name: string;
    inGame: boolean;
    type: string;
    gameRole?: gameRole;
    _id?: ObjectId;
    score?: number;
};

export function narrowToPlayer(sth: unknown): IPlayer {
    if (sth === null || typeof sth !== 'object') {
        throw new Error(`something that was supposed to be a player isn\'t: ${sth}`);
    };
    if ('name' in sth && 'inGame' in sth) {
        return sth as IPlayer;
    }
    throw new Error('must give postFetch an IPostOBj via useQuery');
}