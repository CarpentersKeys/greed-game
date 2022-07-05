import { EGameRoles, IPlayer } from "./player/types";
import { IGame } from "./game/types";
import mongoose from "mongoose";

export const ObjectId = mongoose.Types.ObjectId;
export type TObjectId = typeof ObjectId;
export type TEvaluator<T> = (a: unknown) => T | false
// TODO: fix this embarassing mess

const id = new ObjectId(32141)

export function narrowToPlayer(sth: unknown): IPlayer {
    if (sth === null || typeof sth !== 'object') {
        throw new Error(`something that was supposed to be a player isn\'t: ${sth}`);
    };
    if ('name' in sth) {
        return sth as IPlayer;
    }
    throw new Error('must give postFetch an IPostOBj via useQuery');
}

/**
 * TODO make isObjectId less redundant
 * @param sth 
 * @returns 
 */
export function isObjectId(sth: unknown): sth is TObjectId {
    let boo;
    try {
        const strSth = String(sth)
        if (!sth) { return false }
        boo = String(new ObjectId(strSth)) == strSth;
    } catch (err) { }
    return boo || false
}

// TODO why does sth._id fail ts when sth: unknown
export function isGame(sth: any): sth is IGame {
    if (!sth || sth === null) { return false; };
    if (typeof sth !== 'object') { return false; };
    if (!('_id' in sth && 'players' in sth && 'isOpen' in sth && 'type' in sth && 'gameStage' in sth)) { return false; };
    if (Object.hasOwn(sth, '_id') && !isObjectId(sth?._id)) { return false; };
    return true;
}

export const returnGame: TEvaluator<IGame> = (sth: unknown) => {
    return isGame(sth) && sth as IGame;
}

export const isPlayer = (sth: unknown): sth is IPlayer => {
    if (!sth || sth === null) { return false; };
    if (typeof sth !== 'object') { return false; };
    if (!('_id' in sth && 'type' in sth && 'name' in sth)) { return false; };
    if (!isObjectId((sth as IPlayer)._id)) { return false; };
    return true;
}

export const returnPlayer: TEvaluator<IPlayer> = (sth: unknown) => {
    return isPlayer(sth) && sth as IPlayer;
}

export function hasSameId(contextId: TObjectId | undefined | null) {
    const evalu: TEvaluator<boolean> = (data) => contextId === (data as { _id: TObjectId })._id
    return evalu;
}

export function isGameRole(sth: unknown): sth is EGameRoles {
    return sth === EGameRoles.GREEDY_PLAYER || sth === EGameRoles.TIMER_PLAYER;
}