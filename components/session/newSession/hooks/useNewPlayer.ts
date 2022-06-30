import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { useAppContext } from "../../../../context/appContext";
import makeMutationFn, { IMutationVariables } from "../../../../fetchers/makeMutationFn";
import { CREATE_PLAYER } from "../../../../lib/famousStrings";
import { IPlayer } from "../../../../models/player/types";
import { isPlayer } from "../../../../models/typeCheckers";
import { queryClient } from "../../../../pages/_app";
import { IUseMutatePlayerFnArgs } from "../../../shared/hooks/player/useMutatePlayer";
import { validateData } from "../../../shared/useOnSuccess";

const functionName = 'useNewPlayer'
export default function useNewPlayer() {
    const { updateAppState } = useAppContext();

    const onSuccess = useCallback((data: unknown, variables?: IMutationVariables) => {
        const player = validateData(isPlayer, { functionName })(data, variables);
        updateAppState({ playerId: player?._id });
        queryClient.setQueriesData('player', player);
    }, [functionName]);

    const { reset: rstUseNewPlayer, mutate: mutatePlayer, isLoading: playerLoading }
        = useMutation<IPlayer, unknown, IUseMutatePlayerFnArgs, unknown>(
            makeMutationFn('player'),
            {
                onSuccess
            },
        )
    useEffect(() => { updateAppState({ cleanupFns: rstUseNewPlayer }); }, [rstUseNewPlayer])

    function submitNewPlayer(playerName: string) {
        mutatePlayer({ endPoint: CREATE_PLAYER, postData: playerName });
    };

    return { submitNewPlayer, playerLoading };
}