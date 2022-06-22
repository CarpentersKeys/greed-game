import { IPlayer } from "../models/player/types";
import { QueryKey } from "react-query";
import { TObjectId } from "../models/typeCheckers";
import { STATE_QUERY } from "../lib/famousStrings";
import { IGame } from "../models/game/types";

export interface IPostObj {
    endPoint: string;
    postData: string | TObjectId;
}

function narrowToObj(sth: unknown): IPostObj {
    try {
        if (sth === null || !sth) { throw new Error('input to narrow to object is falsy'); }
        if (typeof sth !== 'object') { throw new Error('input to narrow to object isnt an object'); };
        if (!('endPoint' in sth)) { throw new Error('input to narrow to object is missing endpoint field'); };
        if (!('postData' in sth)) { throw new Error('input to narrow to object is missing postData field'); };
        const probably = sth as IPostObj;
        if (typeof probably?.endPoint !== 'string') { throw new Error('input to narrow to objects .endPoint isnt a string'); }
        return probably;
    } catch (err) {
        throw err + ' input: ' + JSON.stringify(sth)
    }
}

export default async function stateFetch({ queryKey }: { queryKey: QueryKey }): Promise<{[STATE_QUERY]: IPlayer} | {[STATE_QUERY]: IGame}> {
    const path = queryKey[0];

    const postObj = narrowToObj(queryKey[1]);

    // console.log('prefetch',path, 'postObj: ', postObj)
    const urlResp: Response =
        await fetch(`api/${path}/${JSON.stringify(postObj)}`);
    if (!urlResp.ok) {
        const err = await urlResp.json();
        throw err
    }
    // get a result back
    return (urlResp.ok && await urlResp.json());
}