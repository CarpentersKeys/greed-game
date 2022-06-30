import { TObjectId } from "../../../../models/typeCheckers";
import { useContext, useEffect, useRef, useState } from "react";
import { DELETE_PLAYER, REMOVE_PLAYER_FROM_GAME } from "../../../../lib/famousStrings";
import makeMutationFn from "../../../../fetchers/makeMutationFn";
import { useMutation } from "react-query";
import { IAppState, useAppContext } from "../../../../context/appContext";
import { useRouter } from "next/router";
import { IUseMutatePlayerFnArgs } from "../../../shared/hooks/player/useMutatePlayer";

export default function useEndSesssion() {
    // TODO: currently this hook may have problems with reference vs value and closure in the onSuccess callbacks
    const { appState, playerId, gameId, cleanupFns, updateAppState } = useAppContext();
    const { mutate: mutatePlayer, isloading: deletePlayerLoading }
        = useMutation<any, unknown, IUseMutatePlayerFnArgs, unknown>(makeMutationFn('player'),
            {
                onSuccess({ DELETE_PLAYER }) {
                    console.log('appStateSet: DLETE onSuccess top')
                    // abthis
                    // const { playerId, cleanupFns } = useAppContext();
                    if (DELETE_PLAYER && playerId && cleanupFns) {
                        if (cleanupFns.length > 0) {
                            cleanupFns?.forEach(fn => {
                                fn();
                            });
                            updateAppState({ playerId: null, cleanupFns: [] })
                        }
                    }
                },
            }
        )

    function deletePlayer(playerId: TObjectId) { mutatePlayer({ endPoint: DELETE_PLAYER, postData: playerId }); };

    return { deletePlayer, deletePlayerLoading };
}