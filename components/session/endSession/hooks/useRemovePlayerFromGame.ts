import { check, isGame, TObjectId } from "../../../../models/typeCheckers";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { DELETE_PLAYER, REMOVE_PLAYER_FROM_GAME } from "../../../../lib/famousStrings";
import makeMutationFn, { IMutationVariables } from "../../../../fetchers/makeMutationFn";
import { useMutation } from "react-query";
import { IAppState, IAppStateUpdate, useAppContext } from "../../../../context/appContext";
import { useRouter } from "next/router";
import { IUseMutatePlayerFnArgs } from "../../../shared/hooks/player/useMutatePlayer";
import { IGame } from "../../../../models/game/types";
import { json } from "stream/consumers";

'useRemovePlayerFromGame'
export default function useRemovePlayerFromGame() {
    const { playerId, cleanupFns, updateAppState } = useAppContext();
    const onSuccess = useCallback(makeOnSucces(playerId, updateAppState, cleanupFns, arguments.callee.name), [playerId, cleanupFns, updateAppState])

    const { mutate: mutateGame, isLoading: isRemovingPlayerFromGame }
        = useMutation<IGame, unknown, IMutationVariables, unknown>(
            makeMutationFn('game'), { onSuccess },
        )

    function removePlayerFromGame(playerId: TObjectId) {
        mutateGame({ endPoint: REMOVE_PLAYER_FROM_GAME, id: playerId });
    };

    return { removePlayerFromGame, isRemovingPlayerFromGame };
}
