import { useMutation } from "react-query";
import { TObjectId } from "../models/typeCheckers";
import makeMutationFn from "../fetchers/makeMutationFn";
import { CREATE_PLAYER, DELETE_PLAYER } from "../lib/famousStrings";

/**
 * fetches to the player/[...key] endpoint and registers a new player
 * @param 
 * @returns UseQueryResult<IPlayer>
 */

export default function useMutatePlayer() {
    const {
        reset,
        data,
        mutate,
        ...rest
    } = useMutation<IUseMutatePlayerReturn, unknown, IUseMutatePlayerFnArgs, unknown>(makeMutationFn('player'),
        {
            onSuccess(_, variables) {
                if (variables?.endPoint === DELETE_PLAYER) { reset(); }
            },
        }
    )

    function submitNewPlayer(playerName: string) { mutate({ endPoint: CREATE_PLAYER, postData: playerName }); };
    function deletePlayer(playerId: TObjectId) { mutate({ endPoint: DELETE_PLAYER, postData: playerId }); };
    const newPlayerId = data?.[CREATE_PLAYER];
    const deletedPlayerId = data?.[DELETE_PLAYER];

    return { deletePlayer, deletedPlayerId, submitNewPlayer, newPlayerId, ...rest };
};

interface IUseMutatePlayerFnArgs { endPoint: string, postData: any }
interface IUseMutatePlayerReturn { [CREATE_PLAYER]: TObjectId | undefined, [DELETE_PLAYER]: TObjectId | undefined }