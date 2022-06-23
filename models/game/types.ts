import mongoose from 'mongoose';
import IRoundResult from "../roundResult/types";
import { TObjectId } from "../typeCheckers";

export enum EJoinedOrCreated {
    GAME_JOINED = 'gameJoined',
    GAME_CREATED = 'gameCreated',
}

export interface IGame extends mongoose.Types.Subdocument{
    //TODO: autoMatch: 
    _id: TObjectId;
    players: TObjectId[];
    type: string;
    isOpen: boolean;
    gameStage: string;
    roundResults?: IRoundResult[];
    _createdAt?: Date;
    _updatedAt?: Date;
    name?: string;
};
export interface IGameUpdate{
    //TODO: autoMatch: 
    _id: TObjectId;
    players?: TObjectId[];
    type?: string;
    isOpen?: boolean;
    gameStage?: string;
    roundResults?: IRoundResult[];
    _createdAt?: Date;
    _updatedAt?: Date;
    name?: string;
};