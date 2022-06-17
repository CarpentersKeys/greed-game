import mongoose, { Types } from 'mongoose';
import { IPlayer } from "../player/types";
import IRoundResult from "../roundResult/types";

export interface IGame extends mongoose.Types.Subdocument{
    //TODO: autoMatch: 
    name: string;
    players: IPlayer[];
    type: string;
    isOpen: boolean;
    gameStage: string;
    roundResults?: IRoundResult[];
    _createdAt?: Date;
    _updatedAt?: Date;
    _id?: Types.ObjectId;
};