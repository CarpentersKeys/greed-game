import { useMutation } from "react-query";
import { TObjectId } from "../../models/typeCheckers";
import makeMutationFn from "../../fetchers/makeMutationFn";
import { ASSIGN_ROLES, CREATE_PLAYER, DELETE_PLAYER, UPDATE_STATE } from "../../lib/famousStrings";
import { IPlayerUpdate } from "../../models/player/types";
import { useState } from "react";

/**
 * fetches to the player/[...key] endpoint and registers a new player
 * @param 
 * @returns UseQueryResult<IPlayer>
 */
export default function useMutatePlayer() {
    const [updatedPlayerId, updatedPlayerIdSet] = useState<TObjectId | undefined | null>(null);
    const {
        reset,
        data,
        mutate,
        ...rest
    } = useMutation<IMutatePlayerResultData, unknown, IUseMutatePlayerFnArgs, unknown>(makeMutationFn('player'),
        {
            onSuccess(data, variables) {
                const { [UPDATE_STATE]: uPI } = data;
                uPI && updatedPlayerIdSet(uPI);
            },
        }
    )

    function assignRoles(playerId: TObjectId) { mutate({ endPoint: ASSIGN_ROLES, postData: playerId }); };
    function updatePlayerState(update: IPlayerUpdate) { mutate({ endPoint: UPDATE_STATE, postData: update }); };

    return { reset, assignRoles, updatePlayerState, updatedPlayerId, ...rest };
};

export interface IUseMutatePlayerFnArgs { endPoint: string, postData: any }
export interface IMutatePlayerResultData { // remember, 
    [UPDATE_STATE]?: TObjectId;
    [CREATE_PLAYER]?: TObjectId;
    [DELETE_PLAYER]?: TObjectId;
    [ASSIGN_ROLES]?: TObjectId[];
}