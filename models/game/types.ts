import { Types } from 'mongoose';
import { IPlayer } from "../player/types";
import IRoundResult from "../roundResult/types";

export interface IGame {
    //TODO: autoMatch: 
    players: IPlayer[];
    roundResults?: IRoundResult[];
    gameStage?: string;
    _createdAt?: Date;
    _updatedAt?: Date;
    _id?: Types.ObjectId;
};

export interface IGameModel {
    new(obj: IGame): IGame;
} 