import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { useAppContext } from "../../../../context/appContext";
import stateFetch from "../../../../fetchers/stateFetch";
import { STATE_QUERY } from "../../../../lib/famousStrings";
import { IGame } from "../../../../models/game/types";
import { check, isGame } from "../../../../models/typeCheckers";
import { TObjectId } from "../../../../models/typeCheckers";

/**
 * continuously fetches for gameState
 * @param gameId
 * @returns UseQueryResult<IGame>
 */
const USE_GAME_STATE = 'useGameState' // TODO how am I supposed to get the fn name into onSuccess dynamically?
interface IOptions { onGameId: (data: IGame) => void };
export default function useGameState(options: IOptions) {
    const { gameId } = useAppContext();
    const checkIsGame = useCallback(check(isGame, STATE_QUERY, gameId, USE_GAME_STATE), [gameId]);

    return useQuery([
        'game',
        { endPoint: STATE_QUERY, postData: gameId, }
    ], stateFetch,
        {
            enabled: !!gameId,
            keepPreviousData: !!gameId,
            onSuccess: checkIsGame,
        }
    );
};
