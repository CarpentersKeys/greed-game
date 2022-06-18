import { useQuery, UseQueryResult } from "react-query";
import postFetch from "../fetchers/postFetch";
import { ObjectId } from "mongoose";
import { IGame, narrowToGame } from "../models/game/types";

/**
 * continuously fetches for gameState
 * @param gameId
 * @returns UseQueryResult<IGame>
 */
export default function useGameState(gameId: ObjectId | undefined | null) {
    console.log('gameId', gameId)
    const { data: gameState, ...rest } = useQuery([
        'game',
        { endPoint: 'state', postData: gameId, }
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

    return{ gameState, ...rest };
};