import { useCallback } from "react";
import { QueryKey, useQuery } from "react-query";
import { useAppContext } from "../../../../context/appContext";
import stateFetch from "../../../../fetchers/stateFetch";
import { STATE_QUERY } from "../../../../lib/famousStrings";
import { IPlayer } from "../../../../models/player/types";
import { check, isPlayer, TObjectId } from "../../../../models/typeCheckers";

const USE_PLAYER_STATE = 'usePlayerState' // TODO how am I supposed to get the fn name into onSuccess dynamically?
interface IOptions { onPlayerId: (data: IPlayer) => void };
export default function usePlayerState(options?: IOptions) {
    const { playerId } = useAppContext();
    const checkIsPlayer = useCallback(check(isPlayer, STATE_QUERY, playerId, USE_PLAYER_STATE),
        [playerId]);

    const { data: playerState, isLoading, isError } = useQuery<IPlayer, unknown, IPlayer, QueryKey>([
        'player',
        { endPoint: STATE_QUERY, id: playerId, }
    ], stateFetch,
        {
            enabled: !!playerId,
            keepPreviousData: !!playerId,
            onSuccess: (data) => {
                checkIsPlayer(data);
                if (options?.onPlayerId && data?._id) { options?.onPlayerId(data); };
            },
        },
    );

    return {
        ...playerState,
        playerId: playerState?._id,
        playerLoading: isLoading,
        playerError: isError
    }
};