import { IPlayer } from "../models/player/types";
import { QueryKey } from "react-query";
import { Schema, ObjectId as IObjectId } from "mongoose";

interface IPostObj {
    endPoint: string;
    postString: string | IObjectId;
}

function narrowToObj(sth: unknown): IPostObj {
    const ObjectId = Schema.Types.ObjectId;
    if (typeof sth !== 'object'
        || sth === null
    ) {
        throw new Error('1must give postFetch an IPostOBj via useQuery');
    };
    if ('endPoint' in sth && 'postString' in sth) {
        const probably = sth as IPostObj;
        if (typeof probably.endPoint !== 'string') { throw new Error('method not string'); }
        const isString = typeof probably.postString === 'string';
        const isObjectId = probably.postString instanceof ObjectId;
        if (isString || isObjectId) {
            return probably;
        }
    }
    throw new Error('3must give postFetch an IPostOBj via useQuery');
}

export default async function postFetch({ queryKey }: { queryKey: QueryKey }): Promise<IPlayer> {
    const _key = queryKey[0];

    const postObj = narrowToObj(queryKey[1]);
    // const { endPoint, postString } = postObj;

    const urlResp: Response =
        await fetch(`api/${_key}/${JSON.stringify(postObj)}`);

    // get a result back
    return (urlResp.ok && await urlResp.json());
}