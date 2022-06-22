import { useQuery } from "react-query";
import stateFetch from "../fetchers/stateFetch";
import { STATE_QUERY } from "../lib/famousStrings";
import { narrowToGame } from "../models/typeCheckers";
import { TObjectId } from "../models/typeCheckers";

/**
 * continuously fetches for gameState
 * @param gameId
 * @returns UseQueryResult<IGame>
 */
const USE_GAME_STATE = 'useGameState' // TODO how am I supposed to get the fn name into onSuccess dynamically?
export default function useGameState(gameId: TObjectId | undefined | null) {
    return useQuery([
        'game',
        { endPoint: STATE_QUERY, postData: gameId, }
    ], stateFetch,
        {
            enabled: !!gameId,
            keepPreviousData: !!gameId,
            onSuccess: (data) => {
                try {
                    narrowToGame(data);
                } catch (err) {
                    console.error(`error in ${USE_GAME_STATE}\nendpoint: ${STATE_QUERY}\ngameId:${JSON.stringify(gameId)}name\n${err}`);
                }
            },
        }
    );

};