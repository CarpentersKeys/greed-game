import { TObjectId } from "../../../../models/typeCheckers";
import { useContext, useEffect, useRef, useState } from "react";
import { DELETE_PLAYER, REMOVE_PLAYER_FROM_GAME } from "../../../../lib/famousStrings";
import makeMutationFn, { IMutationVariables } from "../../../../fetchers/makeMutationFn";
import { useMutation } from "react-query";
import { IAppState, useAppContext } from "../../../../context/appContext";
import { useRouter } from "next/router";

export default function useEndSesssion() {
    // TODO: currently this hook may have problems with reference vs value and closure in the onSuccess callbacks
    const { appState, playerId, gameId, cleanupFns, updateAppState } = useAppContext();
    const [endingSession, endingSessionSet] = useState<boolean>(false);
    const ref = useRef<undefined | IAppState>();
    console.log('whenIClick')
    useEffect(() => {
        if (appState !== ref.current) {
            ref.current = appState;
            console.log('appState changed')
        }
    }, [appState])
    const { mutate: mutateGame }
        = useMutation<any, unknown, IMutationVariables, unknown>(
            makeMutationFn('game'),
            {
                // cannot get updated state during callback
                onSuccess({ [REMOVE_PLAYER_FROM_GAME]: updateObj }) {
                    console.log('appStateSet: REMOVE onSuccess top')
                    console.log('REMOVE_PLAYER_FROM_GAME:', updateObj)
                    // console.log('data:', data)

                    console.log('appStateSet: REMOVE onSuccess useAppContext', gameId)
                    // abthis
                    if (updateObj && playerId) {
                        console.log('appStateSet: REMOVE conditions passed')
                        updateAppState({ gameId: null });
                        console.log('appStateSet: REMOVE onSuccess useAppContext', gameId)
                        if ((gameId === null) && endingSession) {
                            console.log('appStateSet: REMOVE deletePlayer called')
                            deletePlayer(playerId);
                            endingSessionSet(false);
                        }
                        console.log('appStateSet: REMOVE onSuccess useAppContext', gameId)
                    }
                }
            },
        )

    console.log('appStateSet: outside useAppContext', gameId)
    const { mutate: mutatePlayer }
        = useMutation<any, unknown, IMutationVariables, unknown>(makeMutationFn('player'),
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
    useEffect(() => {
    }, [endingSession, playerId, gameId])

    function removePlayerFromGame(playerId: TObjectId) { mutateGame({ endPoint: REMOVE_PLAYER_FROM_GAME, postData: playerId }); };
    function deletePlayer(playerId: TObjectId) { mutatePlayer({ endPoint: DELETE_PLAYER, postData: playerId }); };

    function endSession(): void {
        if (playerId) {
            console.log('endSession call')
            endingSessionSet(true);
            removePlayerFromGame(playerId);
        }
    };

    return endSession;
}