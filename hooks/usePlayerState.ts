import { EnsuredQueryKey, useQuery, UseQueryResult } from "react-query";
import { IPlayer } from "../models/player/types"
import { ObjectId } from 'mongoose';

export interface usePlayerStateResult {
    isLoading: boolean;
    error: Error | unknown;
    playerState: IPlayer;
}


export default function usePlayerState(playerId: ObjectId | null): usePlayerStateResult {
    const { isLoading, error, data } = useQuery([playerId], async ({ queryKey }) => {
        if(!queryKey[0]) { return;};

        return fetch(`/api/player/${queryKey[0]}`)
            .then(resp => {
                return resp.json()
            })
    });

    // console.log('UQisl:', isLoading)
    // console.log('UQerr', error)
    // console.log('UQplayerstate', data)

    return ({
        isLoading,
        error,
        playerState: data,
    })
};