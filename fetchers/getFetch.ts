import { QueryKey } from "react-query";
import { IGame } from "../models/game/types";
import { IPlayer } from "../models/player/types";

export interface IEndpointObj {
    endPoint: string;
}

export default async function postFetch({ queryKey }: { queryKey: QueryKey }): Promise<{ games: IPlayer[] }|{ games: IGame[] }> {
    const path = queryKey[0];
    const postObj = (queryKey[1]);
    if (postObj === null || typeof postObj !== 'object') { throw new Error('get fetch didnt get an object '); };
    if (!('endPoint' in postObj)) { throw new Error('get fetch didnt get an endpoint'); };

    const urlResp: Response =
        await fetch(`api/${path}/${JSON.stringify(postObj)}`);
    if (!urlResp.ok) {
        const err = await urlResp.json();
        console.error(err);
    }
    // get a result back
    return (urlResp.ok && await urlResp.json());
}