import { TObjectId } from "../../models/typeCheckers";
import { useContext } from "react";
import { JOIN_OR_CREATE_GAME } from "../../lib/famousStrings";
import makeMutationFn from "../../fetchers/makeMutationFn";
import { useMutation } from "react-query";
import { AppContext } from "../../context/appContext";
import { EJoinedOrCreated } from "../../models/game/types";

export default function useNewGame() {
    const { appState, appStateSet } = useContext(AppContext);
    const { reset: rstUseNewGame, mutate: mutateGame }
        = useMutation<IUseMutateGameResultData, unknown, IUseMutateGameFnArgs, unknown>(
            makeMutationFn('game'),
            {
                onSuccess(data) {
                    const { [JOIN_OR_CREATE_GAME]: resultObj } = data;
                    const nGI = resultObj?.[EJoinedOrCreated.GAME_JOINED] || resultObj?.[EJoinedOrCreated.GAME_CREATED]
                    if (nGI && appStateSet) {
                        const update = { ...appState };
                        update.gameId = nGI;
                        update.cleanupFns = [...appState.cleanupFns, rstUseNewGame]
                        appStateSet(update);
                    }
                }
            },
        )
    function joinOrCreateGame(playerId: TObjectId) {
        mutateGame({ endPoint: JOIN_OR_CREATE_GAME, postData: playerId });
    };

    return joinOrCreateGame;
}

interface IUseMutateGameFnArgs { endPoint: string, postData: any }
interface IUseMutateGameResultData {
    [JOIN_OR_CREATE_GAME]?: {
        [EJoinedOrCreated.GAME_CREATED]?: TObjectId
        [EJoinedOrCreated.GAME_JOINED]?: TObjectId
    }
}