import { useCallback } from "react";
import { DELETE_PLAYER } from "../../../../lib/famousStrings";
import makeMutationFn, { IMutationVariables } from "../../../../fetchers/makeMutationFn";
import { useMutation } from "react-query";
import { useAppContext } from "../../../../context/appContext";
import { IPlayer } from "../../../../models/player/types";
import { returnPlayer, TObjectId } from "../../../../models/typeCheckers";

const functionName = useDeletePlayer;

export default function useDeletePlayer() {
    // TODO: currently this hook may have problems with reference vs value and closure in the onSuccess callbacks
    const { playerId, cleanupFns, updateAppState } = useAppContext();
    const onSuccess = useCallback((data: unknown, variables: unknown) => {
        const player = returnPlayer(data);
        if (!player) { throw new Error(noPlayerErrorString(data, variables, playerId)); };
        if (cleanupFns.length > 0) {
            cleanupFns?.forEach(fn => {
                fn();
            });
            updateAppState({ cleanupFns: []});
        };
        updateAppState({ playerId: null })
    }, [updateAppState, cleanupFns, playerId,]);

    const { mutate: mutatePlayer, isLoading: deletePlayerLoading }
        = useMutation<IPlayer, unknown, IMutationVariables, unknown>(makeMutationFn('player'), { onSuccess, });

    const deletePlayer = useCallback(() => {
        if (!playerId) { throw new Error('tried delete nonexistant player') }
        mutatePlayer({ endPoint: DELETE_PLAYER, id: playerId });
    }, [mutatePlayer, playerId]);

    return { deletePlayer, deletePlayerLoading };
}

const noPlayerErrorString = (data: unknown, variables: unknown, playerId: TObjectId | null) => `Server did\'nt return a player to ${functionName}
        \nData: ${data}, \nMutation variables${variables}\n playerId: ${playerId}`