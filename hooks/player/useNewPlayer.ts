import { IUseMutatePlayerFnArgs } from "./useMutatePlayer";
import { TObjectId } from "../../models/typeCheckers";
import { useContext, useEffect } from "react";
import { CREATE_PLAYER } from "../../lib/famousStrings";
import makeMutationFn from "../../fetchers/makeMutationFn";
import { useMutation } from "react-query";
import { AppContext } from "../../context/playerContext";

export default function useNewPlayer() {
    const { appState, appStateSet } = useContext(AppContext);

    const { reset: rstUseNewPlayer, mutate: mutatePlayer, data }
        = useMutation<{ [CREATE_PLAYER]: TObjectId }, unknown, IUseMutatePlayerFnArgs, unknown>(
            makeMutationFn('player'),
            {
                onSuccess(data) {
                    const { [CREATE_PLAYER]: nPI } = data;
                    if (nPI && appStateSet) {
                        const update = { ...appState };
                        update.cleanupFns.push(rstUseNewPlayer);
                        update.playerId = nPI;
                        appStateSet(update);
                    }
                }
            },
        )
    function submitNewPlayer(playerName: string) { mutatePlayer({ endPoint: CREATE_PLAYER, postData: playerName }); };

    return submitNewPlayer;
}