import { useQuery } from "react-query";
import { useAppContext } from "../../../../context/appContext";
import stateFetch from "../../../../fetchers/stateFetch";
import { STATE_QUERY } from "../../../../lib/famousStrings";
import { IGame } from "../../../../models/game/types";
import { isGame } from "../../../../models/typeCheckers";
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
    return useQuery([
        'game',
        { endPoint: STATE_QUERY, postData: gameId, }
    ], stateFetch,
        {
            enabled: !!gameId,
            keepPreviousData: !!gameId,
            onSuccess: (data) => {
                !isGame(data)
                    && console.error(`error in ${USE_GAME_STATE}\nendpoint: ${STATE_QUERY}\ngameId:${JSON.stringify(gameId)}name\n${data}`);
            },
        }
    );

};