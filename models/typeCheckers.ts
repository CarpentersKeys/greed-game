import { IPlayer } from "./player/types";
import { IGame } from "./game/types";
import mongoose from "mongoose";

export type TObjectId = mongoose.ObjectId;
export const ObjectId = mongoose.Types.ObjectId;

export function narrowToPlayer(sth: unknown): IPlayer {
    if (sth === null || typeof sth !== 'object') {
        throw new Error(`something that was supposed to be a player isn\'t: ${sth}`);
    };
    if ('name' in sth && 'inGame' in sth) {
        return sth as IPlayer;
    }
    throw new Error('must give postFetch an IPostOBj via useQuery');
}

/**
 * TODO make isObjectId less redundant
 * @param sth 
 * @returns 
 */
export function isObjectId(sth: unknown) {
    const strSth = String(sth)
    const boo = String(new ObjectId(strSth)) == strSth;
    return boo
}

export function narrowToGame(sth: unknown) {
    if(!sth) {throw new Error(`tried to pass nothing to narrow to game. \nsee?: ${sth}`)}
    if(typeof sth !== 'object') {throw new Error(`tried to pass non object to narrow to game. \nksee?: ${sth}`)}
    if ('players' in sth && 'isOpen' in sth && 'type' in sth && 'gameStage' in sth) {
        return sth as IGame;
    }
    throw new Error('tried to pass non IGame to postFetch via useQuery');
}