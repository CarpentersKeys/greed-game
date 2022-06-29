import { useMutation } from "react-query";
import makeMutationFn from "../../../../fetchers/makeMutationFn";
import { JOIN_OR_CREATE_GAME, REMOVE_PLAYER_FROM_GAME, UPDATE_STATE } from "../../../../lib/famousStrings";
import { EJoinedOrCreated, IGameUpdate } from "../../../../models/game/types";
import { TObjectId } from "../../../../models/typeCheckers";

export default function useMutateGame(newPlayerId: TObjectId | undefined | null, assignRoles: null | ((a: TObjectId) => void),) {

    const {
        reset: gameReset,
        data,
        mutate,
        ...rest
    } = useMutation<IUseMutateGameResultData, unknown, IUseMutateGameFnArgs, unknown>(makeMutationFn('game'));

    function joinOrCreateGame(playerId: TObjectId) { mutate({ endPoint: JOIN_OR_CREATE_GAME, postData: playerId }); };
    function updateGameState(updatedGame: IGameUpdate) { mutate({ endPoint: UPDATE_STATE, postData: updatedGame }); };
    const newGameId = data?.[JOIN_OR_CREATE_GAME]?.[EJoinedOrCreated.GAME_CREATED]
        || data?.[JOIN_OR_CREATE_GAME]?.[EJoinedOrCreated.GAME_CREATED];
    const deletedPlayer = data?.[REMOVE_PLAYER_FROM_GAME];

    return {
        updateGameState,
        deletedPlayer,
        newGameId,
        gameReset,
        joinOrCreateGame,
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
