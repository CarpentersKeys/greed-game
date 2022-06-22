import { useQuery, UseQueryResult } from "react-query";
import stateFetch from "../fetchers/stateFetch";
import { STATE_QUERY } from "../lib/famousStrings";
import { IPlayer } from "../models/player/types";
import { TObjectId, narrowToPlayer } from "../models/typeCheckers";

/**
 * continuously fetches for playerState
 * @param playerId 
 * @returns UseQueryResult<IPlayer>
 */
const USE_PLAYER_STATE = 'usePlayerState' // TODO how am I supposed to get the fn name into onSuccess dynamically?
export default function usePlayerState(playerId: TObjectId | undefined | null) {
    const { data, ...rest } = useQuery([
        'player',
        { endPoint: STATE_QUERY, postData: playerId, }
    ], stateFetch,
        {
            enabled: !!playerId,
            keepPreviousData: !!playerId,
            onSuccess: (data) => {
                try {
                    narrowToPlayer(data?.[STATE_QUERY]);
                } catch (err) {
                    console.error(`error in ${USE_PLAYER_STATE}\nendpoint: ${STATE_QUERY}\nplayerId:${playerId}name\n${err}`);
                }
            },
        }
    );

    const playerState = data?.[STATE_QUERY];
    return { playerState, ...rest };
};