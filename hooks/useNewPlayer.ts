import { ObjectId } from "mongoose";
import { useMutation } from "react-query";
/**
 * fetches to the player/[...key] endpoint and registers a new player
 * @param name 
 * @returns UseQueryResult<IPlayer>
 */
async function mutationFn(name: string) {
    const postObj = { endPoint: 'new', postData: name };
    const resp = await fetch(`/api/player/${JSON.stringify(postObj)}`);
    if (resp.ok) {
        return await resp.json();
    } else {
        const problem = await resp.text()
        throw new Error(`new player mutation got a bad response back ${problem}`);
    };
}

export default function useNewPlayer() {
    const {
        reset: playerReset,
        data: newPlayerId,
        mutate: submitNewPlayer,
        ...rest
    } = useMutation<ObjectId, unknown, string, unknown>(mutationFn);

    return { playerReset, newPlayerId, submitNewPlayer, ...rest };
};