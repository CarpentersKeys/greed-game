import mongoose from 'mongoose';
import IRoundResult from "../roundResult/types";
import { TObjectId } from "../typeCheckers";

export interface IGame extends mongoose.Types.Subdocument{
    //TODO: autoMatch: 
    players: TObjectId[];
    type: string;
    isOpen: boolean;
    gameStage: string;
    roundResults?: IRoundResult[];
    _createdAt?: Date;
    _updatedAt?: Date;
    _id?: TObjectId;
    name?: string;
};
