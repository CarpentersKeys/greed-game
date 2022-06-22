import { QueryKey } from "react-query";
import { GET_ALL_QUERY } from "../lib/famousStrings";
import { IGame } from "../models/game/types";
import { IPlayer } from "../models/player/types";

//TODO really not an ideal typing scheme
interface IQueryResults { [GET_ALL_QUERY]: IGame[] | IPlayer[] }
export default async function getFetch({ queryKey }: { queryKey: QueryKey }): Promise<IQueryResults> {
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