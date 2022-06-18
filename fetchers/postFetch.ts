import { IPlayer } from "../models/player/types";
import { QueryKey } from "react-query";
import { Schema, ObjectId as IObjectId, ObjectId } from "mongoose";

export interface IPostObj {
    endPoint: string;
    postData: string | IObjectId;
}

function narrowToObj(sth: unknown): IPostObj {
    const ObjectId = Schema.Types.ObjectId;
    if (typeof sth !== 'object'
        || sth === null
    ) {
        throw new Error('1must give postFetch an IPostOBj via useQuery');
    };
    if ('endPoint' in sth && 'postData' in sth) {
        const probably = sth as IPostObj;
        if (typeof probably.endPoint !== 'string') { throw new Error('method not string'); }
        const isString = typeof probably.postData === 'string';
        const isObjectId = probably.postData instanceof ObjectId;
        if (isString || isObjectId) {
            return probably;
        }
    }
    console.error('error log inside narrowToObj', sth)
    throw new Error('3must give postFetch an IPostOBj via useQuery');
}

export default async function postFetch({ queryKey }: { queryKey: QueryKey }): Promise<IPlayer | ObjectId> {
    const _key = queryKey[0];

    const postObj = narrowToObj(queryKey[1]);
    // const { endPoint, postData} = postObj;

    const urlResp: Response =
        await fetch(`api/${_key}/${JSON.stringify(postObj)}`);
    if (!urlResp.ok) {
        const err = await urlResp.json();
        console.error(err);
    }
    // get a result back
    return (urlResp.ok && await urlResp.json());
}