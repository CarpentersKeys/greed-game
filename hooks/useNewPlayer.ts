import { useMutation } from "react-query";
import { TObjectId } from "../models/typeCheckers";
import makeMutationFn from "../fetchers/makeMutationFn";

/**
 * fetches to the player/[...key] endpoint and registers a new player
 * @param name 
 * @returns UseQueryResult<IPlayer>
 */

export default function useNewPlayer() {
    const {
        reset: playerReset,
        data: newPlayerId,
        mutate: submitNewPlayer,
        ...rest
    } = useMutation<TObjectId, unknown, string, unknown>(makeMutationFn('player', 'new'));

    return { playerReset, newPlayerId, submitNewPlayer, ...rest };
};