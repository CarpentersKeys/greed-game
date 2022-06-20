import { IPlayer } from "./player/types";
import { IGame } from "./game/types";
import mongoose from "mongoose";

export type TObjectId = mongoose.ObjectId;
export const ObjectId = mongoose.Types.ObjectId;
// TODO: fix this embarassing mess

export function isPlayer(obj: any): boolean {
    if (!obj || typeof obj === null) {
        console.error('isPlayer, nithnig here ')
        return false
    };

    if (!('_id' in obj) && isObjectId(obj._id)) {
        console.error('isPlayer, no _id ')
        return false
    };
    if (!('name' in obj)) {
        console.error('isPlayer, no name ')
        return false
    };
    if (!('createdAt' in obj)) {
        console.error('isPlayer, no created ')
        return false
    };
    if (!('updatedAt' in obj)) {
        console.error('isPlayer, no updated')
        return false
    };
    return true;
}

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
export function isObjectId(sth: unknown): boolean | undefined {
    console.log(sth)
    let boo;
    try {
        const strSth = String(sth)
        if (!sth) { return false }
        boo = String(new ObjectId(strSth)) == strSth;
    } catch (err) { }
    return boo
}

export function narrowToGame(sth: unknown) {
    if (!sth || sth === null) { throw new Error(`tried to pass nothing to narrow to game. \nsee?: ${sth}`) }
    if (typeof sth !== 'object') { throw new Error(`tried to pass non object to narrow to game. \nksee?: ${sth}`) }
    if ('players' in sth && 'isOpen' in sth && 'type' in sth && 'gameStage' in sth) {
        return sth as IGame;
    }
    throw new Error('tried to pass non IGame to postFetch via useQuery');
}
// TODO why does sth._id fail ts when sth: unknown
export function isGame(sth: any) {
    if (!sth || sth === null) { return false; };
    if (typeof sth !== 'object') { return false; };
    if (!('_id' in sth && 'players' in sth && 'isOpen' in sth && 'type' in sth && 'gameStage' in sth)) { return false; };
    if (Object.hasOwn(sth, '_id') && !isObjectId(sth._id)) { return false; };
    return true;
}