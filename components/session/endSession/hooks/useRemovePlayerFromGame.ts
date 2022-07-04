import { returnGame } from "../../../../models/typeCheckers";
import { useCallback } from "react";
import { REMOVE_PLAYER_FROM_GAME } from "../../../../lib/famousStrings";
import makeMutationFn, { IMutationVariables } from "../../../../fetchers/makeMutationFn";
import { useMutation } from "react-query";
import { useAppContext } from "../../../../context/appContext";
import { IGame } from "../../../../models/game/types";

const functionName = 'useRemovePlayerFromGame';
export default function useRemovePlayerFromGame() {
    const { playerId, updateAppState } = useAppContext();
    const onSuccess = useCallback((data: unknown, variables: unknown) => {
        const gameRemovedFrom = returnGame(data);
        if (!gameRemovedFrom) {
            throw new Error(`Server did\'nt return a player to ${functionName}. 
        \nData: ${JSON.stringify(data)}\n mutation variables: ${variables}`);
        };
        updateAppState({ gameId: null });
    }, [updateAppState])

    const { mutate: mutateGame, isLoading: removalLoading }
        = useMutation<IGame, unknown, IMutationVariables, unknown>(
            makeMutationFn('game'), { onSuccess },
        )

    const removePlayerFromGame = useCallback(() => {
        if (!playerId) { throw new Error('tried remove nonexistant player from game') }
        mutateGame({ endPoint: REMOVE_PLAYER_FROM_GAME, id: playerId });
    }, [mutateGame, playerId])

    return { removePlayerFromGame, removalLoading };
}
