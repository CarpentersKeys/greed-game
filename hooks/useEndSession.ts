import { IUseMutatePlayerFnArgs } from "./player/useMutatePlayer";
import { TObjectId } from "../models/typeCheckers";
import { useContext, useEffect, useState } from "react";
import { DELETE_PLAYER, REMOVE_PLAYER_FROM_GAME } from "../lib/famousStrings";
import makeMutationFn from "../fetchers/makeMutationFn";
import { useMutation } from "react-query";
import { AppContext } from "../context/appContext";
import { useRouter } from "next/router";

export default function useEndSesssion() {
    // TODO: currently this hook may have problems with reference vs value and closure in the onSuccess callbacks
    const { appState, appStateSet } = useContext(AppContext);
    const { playerId, gameId, cleanupFns } = appState;
    const [endingSession, endingSessionSet] = useState<boolean>(false);

    const { mutate: mutateGame }
        = useMutation<any, unknown, IUseMutatePlayerFnArgs, unknown>(
            makeMutationFn('game'),
            {
                onSuccess(data) {
                    const { [REMOVE_PLAYER_FROM_GAME]: rPFG } = data;
                    if (rPFG && playerId && appStateSet) {
                        const copy = { ...appState };
                        const update = Object.assign(copy, { gameId: null })
                        appStateSet(update)
                    }
                },
            }
        )
    const { mutate: mutatePlayer }
        = useMutation<any, unknown, IUseMutatePlayerFnArgs, unknown>(makeMutationFn('player'),
            {
                onSuccess(data) {
                    const { [DELETE_PLAYER]: dPI } = data;
                    if (dPI && playerId && appStateSet && cleanupFns) {
                        if (cleanupFns.length > 0) {
                            cleanupFns?.forEach(fn => {
                                fn();
                            });
                            const copy = { ...appState };
                            const update = Object.assign(copy, { playerId: null, cleanupFns: [] });
                            appStateSet(update);
                        }
                    }
                },
            }
        )
    useEffect(() => {
        if (!gameId && playerId && endingSession) {
            deletePlayer(playerId);
            endingSessionSet(false);
        }
    }, [endingSession, playerId, gameId])

    function removePlayerFromGame(playerId: TObjectId) { mutateGame({ endPoint: REMOVE_PLAYER_FROM_GAME, postData: playerId }); };
    function deletePlayer(playerId: TObjectId) { mutatePlayer({ endPoint: DELETE_PLAYER, postData: playerId }); };

    function endSession(): void {
        if (playerId) {
            endingSessionSet(true);
            removePlayerFromGame(playerId);
        }
    };

    return endSession;
}