import { useQuery } from "react-query";
import postFetch from "../fetchers/postFetch";
import { narrowToGame } from "../models/typeCheckers";
import { ObjectId, TObjectId } from "../models/typeCheckers";

/**
 * continuously fetches for gameState
 * @param gameId
 * @returns UseQueryResult<IGame>
 */
export default function useGameState(gameId: TObjectId | undefined | null) {
    const { data: gameState, ...rest } = useQuery([
        'game',
        { endPoint: 'stateQuery', postData: gameId, }
    ], postFetch,
        {
            enabled: !!gameId,
            keepPreviousData: !!gameId,
            onSuccess: (gameState) => {
                try {
                    narrowToGame(gameState);
                } catch (err) {
                    console.error(`error in useNewGame \nendpoint: 'getState'\ngameId:${gameId}name\n${err}`);
                }
            },
        }
    );

    return { gameState, ...rest };
};