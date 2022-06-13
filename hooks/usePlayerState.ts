import { useQuery, UseQueryResult } from "react-query";
import { IPlayer } from "../models/player/types"
import { Types as MgsTypes } from 'mongoose';

export interface usePlayerStateResult {
    isLoading: boolean;
    error: Error | unknown;
    playerState: IPlayer;
}


export default function usePlayerState(playerId: MgsTypes.ObjectId | null): usePlayerStateResult {
    const { isLoading, error, data } = useQuery('player', () =>
        fetch('/api/player')
            .then(resp => resp.json())
    );

    return ({
        isLoading,
        error,
        playerState: data,
    })
};