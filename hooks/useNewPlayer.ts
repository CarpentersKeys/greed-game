import { ObjectId } from "mongoose";
import { useMutation } from "react-query";
/**
 * fetches to the player/[...key] endpoint and registers a new player
 * doesn't refech until enabled again(?)
 * @param name 
 * @returns UseQueryResult<IPlayer>
 */


async function mutationFn(name: string) {
    const postObj = { endPoint: 'new', postString: name };
    const resp = await fetch(`api/player/${JSON.stringify(postObj)}`);
    return resp.ok ? await resp.json() : new Error('mutation not ok');
}

export default function useNewPlayer<T>() {
    const {
        reset: sessionReset,
        data: sessionPlayerId,
        mutate: submitNewPlayer,
        ...rest
    } = useMutation<ObjectId | undefined, Error | unknown, string, unknown>(mutationFn);

    return { sessionReset, sessionPlayerId, submitNewPlayer, ...rest };
};