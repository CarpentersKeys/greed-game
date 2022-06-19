import { useMutation } from "react-query";
import { TObjectId } from "../models/typeCheckers";
import makeMutationFn from "../fetchers/makeMutationFn";

/**
 * fetches to the player/[...key] endpoint and registers a new player
 * @param 
 * @returns UseQueryResult<IPlayer>
 */

export default function useMutatePlayer() {
    const {
        reset: playerReset,
        data: newPlayerId,
        mutate,
        ...rest
    } = useMutation<TObjectId, unknown, {endPoint: string, postData: any}, unknown>(makeMutationFn('player'))

    function submitNewPlayer(playerName: string) { mutate({ endPoint: 'new', postData: playerName}); };
    function deletePlayer(playerId: TObjectId) { mutate({ endPoint: 'delete', postData: playerId }); };

    return { playerReset, newPlayerId, submitNewPlayer, deletePlayer, ...rest };
};