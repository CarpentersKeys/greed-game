import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { useAppContext } from "../../../../context/appContext";
import makeMutationFn, { IMutationVariables } from "../../../../fetchers/makeMutationFn";
import { CREATE_PLAYER } from "../../../../lib/famousStrings";
import { IPlayer } from "../../../../models/player/types";
import { returnPlayer } from "../../../../models/typeCheckers";
import { queryClient } from "../../../../pages/_app";

const functionName = 'useNewPlayer'

export default function useNewPlayer() {
    const { updateAppState } = useAppContext();

    const onSuccess = useCallback((data: unknown, variables?: IMutationVariables) => {
        const player = returnPlayer(data);
        if (!player) { throw new Error(`Server did\'nt return a player to ${functionName}. \nData: ${data}`); };
        updateAppState({ playerId: player?._id });
        queryClient.setQueryData('player', player);
    }, [updateAppState]);
    const onMutate = useCallback((newPlayer: IMutationVariables) => {
        const name = newPlayer.postData;
        const previous = queryClient.getQueryData('player')
        queryClient.setQueryData('player', { name });
        return { previous }
    }, [])

    const { reset: rstUseNewPlayer, mutate: mutatePlayer, isLoading: playerLoading }
        = useMutation<IPlayer, unknown, IMutationVariables, unknown>(
            makeMutationFn('player'),
            {
                onSuccess,
                onMutate,
                onSettled() { queryClient.invalidateQueries('player') },
                onError() {
                    queryClient.setQueryData('player', null)
                    rstUseNewPlayer();
                }
            },
        )
    useEffect(() => {
        updateAppState({ cleanupFns: rstUseNewPlayer });
    }, [rstUseNewPlayer, updateAppState])

    function submitNewPlayer(playerName: string) {
        mutatePlayer({ endPoint: CREATE_PLAYER, postData: playerName });
    };

    return { submitNewPlayer, playerLoading };
}