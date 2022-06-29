import { TObjectId } from "../../../../models/typeCheckers";
import { useContext } from "react";
import { JOIN_OR_CREATE_GAME } from "../../../../lib/famousStrings";
import makeMutationFn from "../../../../fetchers/makeMutationFn";
import { useMutation } from "react-query";
import { AppContext, useAppContext } from "../../../../context/appContext";
import { EJoinedOrCreated } from "../../../../models/game/types";
import { IPlayer } from "../../../../models/player/types";

export default function useNewGame() {
    const { appState, updateAppState } = useAppContext();
    const { reset: rstUseNewGame, mutate: mutateGame, isLoading }
        = useMutation<IUseMutateGameResultData, unknown, IUseMutateGameFnArgs, unknown>(
            makeMutationFn('game'),
            {
                onSuccess(data) {
                    const { [JOIN_OR_CREATE_GAME]: resultObj } = data;
                    const nGI = resultObj?.[EJoinedOrCreated.GAME_JOINED] || resultObj?.[EJoinedOrCreated.GAME_CREATED]
                    if (nGI && updateAppState) {
                        const update = { ...appState };
                        update.gameId = nGI;
                        update.cleanupFns = [...appState.cleanupFns, rstUseNewGame]
                        updateAppState(update);
                    }
                }
            },
        )
    function joinOrCreateGame(player: IPlayer) {
        mutateGame({ endPoint: JOIN_OR_CREATE_GAME, postData: player._id });
    };

    return { joinOrCreateGame, gameLoading: isLoading };
}

interface IUseMutateGameFnArgs { endPoint: string, postData: any }
interface IUseMutateGameResultData {
    [JOIN_OR_CREATE_GAME]?: {
        [EJoinedOrCreated.GAME_CREATED]?: TObjectId
        [EJoinedOrCreated.GAME_JOINED]?: TObjectId
    }
}