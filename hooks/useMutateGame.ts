import { useEffect, useRef } from "react";
import { useMutation } from "react-query";
import makeMutationFn from "../fetchers/makeMutationFn";
import { JOIN_OR_CREATE_GAME, REMOVE_PLAYER_FROM_GAME, UPDATE_STATE } from "../lib/famousStrings";
import { EJoinedOrCreated, IGameUpdate } from "../models/game/types";
import { isObjectId, TObjectId } from "../models/typeCheckers";
export default function useMutateGame(newPlayerId: TObjectId | undefined | null, assignRoles: (gameId: TObjectId) => void) {
    const playerId = useRef<TObjectId | null>(null);
    useEffect(() => {
        if (playerId.current !== newPlayerId && isObjectId(newPlayerId)) {
            if (newPlayerId) {
                playerId.current = newPlayerId;
                joinOrCreateGame(newPlayerId);
            } else {
                gameReset();
            }
        }
    }, [newPlayerId]);

    const {
        reset: gameReset,
        data,
        mutate,
        ...rest
    } = useMutation<IUseMutateGameResultData, unknown, IUseMutateGameFnArgs, unknown>(makeMutationFn('game'),
        {
            onSuccess(data) {
                const gameIdJoined = data?.[JOIN_OR_CREATE_GAME]?.[EJoinedOrCreated.GAME_JOINED];
                gameIdJoined && assignRoles(gameIdJoined);
            }
        }
    );

    function joinOrCreateGame(playerId: TObjectId) { mutate({ endPoint: JOIN_OR_CREATE_GAME, postData: playerId }); };
    function removePlayerFromGame(playerId: TObjectId) { mutate({ endPoint: REMOVE_PLAYER_FROM_GAME, postData: playerId }); };
    function updateGameState(updatedPlayer: IGameUpdate) { mutate({ endPoint: UPDATE_STATE, postData: updatedPlayer }); };
    const newGameId = data?.[JOIN_OR_CREATE_GAME]?.[EJoinedOrCreated.GAME_CREATED]
        || data?.[JOIN_OR_CREATE_GAME]?.[EJoinedOrCreated.GAME_CREATED];
    const deletedPlayer = data?.[REMOVE_PLAYER_FROM_GAME];

    return {
        updateGameState,
        deletedPlayer,
        newGameId,
        gameReset,
        joinOrCreateGame,
        removePlayerFromGame,
        ...rest
    };
}
interface IUseMutateGameFnArgs { endPoint: string, postData: any }
interface IUseMutateGameResultData {
    [JOIN_OR_CREATE_GAME]?: {
        [EJoinedOrCreated.GAME_CREATED]?: TObjectId
        [EJoinedOrCreated.GAME_JOINED]?: TObjectId
    }, [REMOVE_PLAYER_FROM_GAME]?: TObjectId
}
