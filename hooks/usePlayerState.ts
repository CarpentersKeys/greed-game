import { useQuery, UseQueryResult } from "react-query";
import postFetch from "../fetchers/postFetch";
import { IPlayer } from "../models/player/types";
import { ObjectId, TObjectId, narrowToPlayer } from "../models/typeCheckers";

/**
 * continuously fetches for playerState
 * @param playerId 
 * @returns UseQueryResult<IPlayer>
 */

export default function usePlayerState(playerId: TObjectId | undefined | null) {
    const { data: playerState, ...rest } = useQuery([
        'player',
        { endPoint: 'getState', postData: playerId, }
    ], postFetch,
        {
            enabled: !!playerId,
            keepPreviousData: !!playerId,
            onSuccess: (data) => {
                try {
                    narrowToPlayer(data);
                } catch (err) {
                    console.error(`error in useNewPlayer \nendpoint: 'getState'\nplayerId:${playerId}name\n${err}`);
                }
            },
        }
    );

    type UseNewPlayerResult = UseQueryResult & {
        playerState: IPlayer
    }

    return<UseNewPlayerResult> { playerState, ...rest };
};