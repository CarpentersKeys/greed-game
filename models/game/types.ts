import mongoose, { Types } from 'mongoose';
import { IPlayer } from "../player/types";
import IRoundResult from "../roundResult/types";

export interface IGame extends mongoose.Types.Subdocument{
    //TODO: autoMatch: 
    players: IPlayer[];
    type: string;
    isOpen: boolean;
    gameStage: string;
    roundResults?: IRoundResult[];
    _createdAt?: Date;
    _updatedAt?: Date;
    _id?: Types.ObjectId;
    name?: string;
};

export function narrowToGame(sth: unknown) {
    if(!sth) {throw new Error(`tried to pass nothing to narrow to game. \nsee?: ${sth}`)}
    if(typeof sth !== 'object') {throw new Error(`tried to pass non object to narrow to game. \nksee?: ${sth}`)}
    if ('players' in sth && 'isOpen' in sth && 'type' in sth && 'gameStage' in sth) {
        return sth as IGame;
    }
    throw new Error('must give postFetch an IPostOBj via useQuery');
}