import { check, isGame, TObjectId } from "../../../../models/typeCheckers";
import { useCallback, useContext } from "react";
import { JOIN_OR_CREATE_GAME } from "../../../../lib/famousStrings";
import makeMutationFn, { IMutationVariables } from "../../../../fetchers/makeMutationFn";
import { useMutation } from "react-query";
import { AppContext, IAppStateUpdate, useAppContext } from "../../../../context/appContext";
import { EJoinedOrCreated, IGame } from "../../../../models/game/types";
import { IPlayer } from "../../../../models/player/types";

export default function useNewGame() {
    const { playerId, updateAppState } = useAppContext();
    const onSuccess = useCallback(makeOnSucces())

    const { reset: rstUseNewGame, mutate: mutateGame, isLoading: gameLoading }
        = useMutation<IGame, unknown, IMutationVariables, unknown>(
            makeMutationFn('game'), { onSuccess })

    function joinOrCreateGame(playerId: TObjectId) {
        mutateGame({ endPoint: JOIN_OR_CREATE_GAME, id: playerId });
    };

    return { joinOrCreateGame, gameLoading };
}

function makeOnSucces(
    playerId: TObjectId | null, updateAppState: (a: IAppStateUpdate) => void, cleanupFns: ((a: any) => void)[], functionName?: string
) {
    const checkIsGame = check(isGame, JOIN_OR_CREATE_GAME, playerId, functionName)
    return (
        function (data: IGame) {
            checkIsGame(data); // error on fail
            updateAppState({ gameId: data._id });
        }
    )
}


interface IUseMutateGameResultData {
    [JOIN_OR_CREATE_GAME]?: {
        [EJoinedOrCreated.GAME_CREATED]?: TObjectId
        [EJoinedOrCreated.GAME_JOINED]?: TObjectId
    }
}