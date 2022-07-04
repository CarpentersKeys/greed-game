import { isGame, returnGame, TObjectId } from "../../../../models/typeCheckers";
import { useCallback } from "react";
import { JOIN_OR_CREATE_GAME } from "../../../../lib/famousStrings";
import makeMutationFn, { IMutationVariables } from "../../../../fetchers/makeMutationFn";
import { useMutation } from "react-query";
import { IAppStateUpdate, useAppContext } from "../../../../context/appContext";
import { EJoinedOrCreated, IGame } from "../../../../models/game/types";

const functionName = 'useNewGame';
export default function useNewGame() {
    const { playerId, updateAppState } = useAppContext();
    const onSuccess = useCallback((data: IGame) => {
        const game = returnGame(data);
        if (!game) { throw new Error(`Server did\'nt return a player to ${functionName}. \nData: ${data}`); };
        updateAppState({ gameId: data._id });
    }, [updateAppState]
    )

    const { reset: rstUseNewGame, mutate: mutateGame, isLoading: gameLoading }
        = useMutation<IGame, unknown, IMutationVariables, unknown>(
            makeMutationFn('game'), { onSuccess })

    function joinOrCreateGame(playerId: TObjectId) {
        mutateGame({ endPoint: JOIN_OR_CREATE_GAME, id: playerId });
    };

    return { joinOrCreateGame, gameLoading };
}