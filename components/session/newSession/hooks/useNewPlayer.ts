import { useContext, useEffect } from "react";
import { useMutation } from "react-query";
import { useAppContext } from "../../../../context/appContext";
import makeMutationFn from "../../../../fetchers/makeMutationFn";
import { CREATE_PLAYER } from "../../../../lib/famousStrings";
import { IPlayer } from "../../../../models/player/types";
import { isPlayer, TObjectId } from "../../../../models/typeCheckers";
import { queryClient } from "../../../../pages/_app";
import { IUseMutatePlayerFnArgs } from "../../../shared/hooks/player/useMutatePlayer";

export default function useNewPlayer() {
    const { updateAppState } = useAppContext();
    const { reset: rstUseNewPlayer, mutate: mutatePlayer, isLoading: playerLoading }
        = useMutation<IPlayer, unknown, IUseMutatePlayerFnArgs, unknown>(
            makeMutationFn('player'),
            {
                onSuccess(player) {
                    if (isPlayer(player) && updateAppState) {
                        updateAppState({ playerId: player._id, cleanupFns: rstUseNewPlayer });
                        queryClient.setQueriesData('player', player);
                    } else {
                        throw new Error(`useNewPlayer mutation did\'t return a player. Data: ${player}`);
                    }
                }
            },
        )
    function submitNewPlayer(playerName: string) { mutatePlayer({ endPoint: CREATE_PLAYER, postData: playerName }); };

    return {submitNewPlayer, playerLoading};
}