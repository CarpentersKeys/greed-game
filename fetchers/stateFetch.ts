import { IPlayer } from "../models/player/types";
import { QueryKey } from "react-query";
import { isGame, isPlayer, TObjectId } from "../models/typeCheckers";
import { STATE_QUERY } from "../lib/famousStrings";
import { IGame } from "../models/game/types";

const STATE_FETCH = 'stateFetch';
export default async function stateFetch({ queryKey }: { queryKey: QueryKey }):
    Promise<any> { // TODO: HOW CAN I MAKE THIS SATISFY IGame AND IPLayer WITHOUGHT offending the use*State hooks
    const path = queryKey[0];
    const postObj = narrowToObj(queryKey[1]);

    const urlResp: Response =
        await fetch(`api/${path}/${JSON.stringify(postObj)}`);
    if (!urlResp.ok) {
        const err = await urlResp.json();
        throw err
    }
    const jsonResp = await urlResp.json()
    if (isPlayer(jsonResp)) { return jsonResp as IPlayer; };
    if (isGame(jsonResp)) { return jsonResp as IGame; };
    throw Error(`${STATE_FETCH} didn't return an IGame or IPlayer`)
}

export interface IPostObj {
    endPoint: string;
    id?: TObjectId;
    postData?: string | TObjectId;
}

function narrowToObj(sth: unknown): IPostObj {
    try {
        if (sth === null || !sth) { throw new Error('input to narrow to object is falsy'); }
        if (typeof sth !== 'object') { throw new Error('input to narrow to object isnt an object'); };
        if (!('endPoint' in sth)) { throw new Error('input to narrow to object is missing endpoint field'); };
        if (!('postData' in sth || 'id' in sth)) { throw new Error('input to narrow to object is missing postData field'); };
        const probably = sth as IPostObj;
        if (typeof probably?.endPoint !== 'string') { throw new Error('input to narrow to objects .endPoint isnt a string'); }
        return probably;
    } catch (err) {
        throw err + ' input: ' + JSON.stringify(sth)
    }
}