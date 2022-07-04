import { useCallback, useEffect, useMemo, useRef } from "react";
import { QueryKey, useQuery } from "react-query";
import { useAppContext } from "../../../../context/appContext";
import { IMutationVariables } from "../../../../fetchers/makeMutationFn";
import stateFetch from "../../../../fetchers/stateFetch";
import { STATE_QUERY } from "../../../../lib/famousStrings";
import { IGame } from "../../../../models/game/types";
import { hasSameId, returnGame } from "../../../../models/typeCheckers";

type TDataCb = ((data?: unknown, variables?: IMutationVariables) => void);
type TDataCbObj = { [index: string]: TDataCb | undefined };
const functionName = useGameState.name;

export default function useGameState(
    { onGameIdDrop, onGameId }: TDataCbObj = {}
) {
    const { gameId } = useAppContext();
    const gameRef = useRef(false);
    useEffect(() => {
        if (gameRef.current && !gameId) {
            onGameIdDrop && onGameIdDrop();
            console.log('game finished!')
            // 1 unload this branch, can't fire again until we get another game
            gameRef.current = false;
        };
    }, [gameRef, gameId, onGameIdDrop])

    const onSuccess = useCallback((data: unknown) => {
        const game = returnGame(data);
        // TODO: complete composeEvaluators
        if (!game) { throw new Error(`Server did\'nt return a player to ${functionName}. \nData: ${JSON.stringify(data)}\nplayerId: ${gameId}`); };
        if (hasSameId(gameId)((data as IGame)._id)) { throw new Error(`Server did\'nt return a matching player to ${functionName}. \nData: ${JSON.stringify(data)}\nplayerId: ${gameId}`); };
        if (!gameRef.current && game._id) {
            onGameId && onGameId(game);
            // 1 unload this branch, can't fire again until we get another game
            gameRef.current = true;
        };
    }, [gameId, onGameId]);

    const { data: gameState, isLoading, isError } = useQuery<IGame, unknown, IGame, QueryKey>([
        'game',
        { endPoint: STATE_QUERY, id: gameId, }
    ], stateFetch,
        {
            enabled: !!gameId,
            keepPreviousData: !!gameId,
            onSuccess,
        }
    );
    return {
        gameRef,
        gameState,
        gameId: gameState?._id,
        gameLoading: isLoading,
        gameError: isError
    }
};
