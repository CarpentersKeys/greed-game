import { useMutation } from "react-query";
import { TObjectId } from "../models/typeCheckers";
import makeMutationFn from "../fetchers/makeMutationFn";
import { CREATE_PLAYER, DELETE_PLAYER, UPDATE_STATE } from "../lib/famousStrings";
import { IPlayerUpdate } from "../models/player/types";
import { useState } from "react";

/**
 * fetches to the player/[...key] endpoint and registers a new player
 * @param 
 * @returns UseQueryResult<IPlayer>
 */

export default function useMutatePlayer() {
    const [newPlayerId, newPlayerIdSet] = useState<TObjectId | undefined | null>(null);
    const [deletedPlayerId, deletedPlayerIdSet] = useState<TObjectId | undefined | null>(null);
    const [updatedPlayerId, updatedPlayerIdSet] = useState<TObjectId | undefined | null>(null);
    const {
        reset,
        data,
        mutate,
        ...rest
    } = useMutation<IUseMutatePlayerReturn, unknown, IUseMutatePlayerFnArgs, unknown>(makeMutationFn('player'),
        {
            onSuccess(data, variables) {
                const { [CREATE_PLAYER]: nPI, [DELETE_PLAYER]: dPI, [CREATE_PLAYER]: uPI } = data;
                nPI && newPlayerIdSet(nPI);
                uPI && updatedPlayerIdSet(uPI);
                if (variables?.endPoint === DELETE_PLAYER) {
                    deletedPlayerIdSet(dPI);
                    newPlayerIdSet(null);
                    reset();
                }
            },
        }
    )
    function submitNewPlayer(playerName: string) { mutate({ endPoint: CREATE_PLAYER, postData: playerName }); };
    function deletePlayer(playerId: TObjectId) { mutate({ endPoint: DELETE_PLAYER, postData: playerId }); };
    function updatePlayerState(update: IPlayerUpdate) { mutate({ endPoint: UPDATE_STATE, postData: update }); };

    return { updatePlayerState, deletePlayer, deletedPlayerId, submitNewPlayer, newPlayerId, updatedPlayerId, ...rest };
};

interface IUseMutatePlayerFnArgs { endPoint: string, postData: any }
interface IUseMutatePlayerReturn {
    [CREATE_PLAYER]: TObjectId | undefined,
    [DELETE_PLAYER]: TObjectId | undefined,
    [UPDATE_STATE]: TObjectId | undefined,
}