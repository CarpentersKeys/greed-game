import { useCallback, useEffect, useRef } from "react";
import { QueryKey, useQuery } from "react-query";
import { useAppContext } from "../../../../context/appContext";
import stateFetch from "../../../../fetchers/stateFetch";
import { STATE_QUERY } from "../../../../lib/famousStrings";
import { IPlayer } from "../../../../models/player/types";
import { hasSameId, returnPlayer, TObjectId } from "../../../../models/typeCheckers";

const noPlayerErrorString = (data: unknown, playerId: TObjectId | null) => `Server did\'nt return a player to ${functionName}. \nData: ${JSON.stringify(data)}\nplayerId: ${playerId}`
const wrongPlayerErrorString = (data: unknown, playerId: TObjectId | null) => `Server did\'nt return a matching player to ${functionName}. \nData: ${JSON.stringify(data)}\nplayerId: ${playerId}`
type TCb = (() => void);
type TDataCb = ((data: IPlayer) => void)
type TDataCbObj = {
    // [index: string]: TDataCb | TCb | undefined,
    onPlayerIdDrop?: TCb,
    onPlayerId?: TDataCb,
};
const functionName = usePlayerState.name;

export default function usePlayerState(
    { onPlayerIdDrop, onPlayerId }: TDataCbObj = {}
) {
    const { playerId, updateAppState } = useAppContext();
    const playerRef = useRef(false);
    useEffect(() => {
        if (playerRef.current && !playerId) {
            onPlayerIdDrop && onPlayerIdDrop();
            // 1 unload this branch, can't fire again until we get another game
            playerRef.current = false;
        };
    }, [playerRef, playerId, onPlayerIdDrop, updateAppState]);

    const onSuccess = useCallback((data: unknown) => {
        const player = returnPlayer(data);
        // TODO: complete composeEvaluators
        if (!player) { throw new Error(noPlayerErrorString(data, playerId)); };
        if (hasSameId(playerId)((data as IPlayer)._id)) { throw new Error(wrongPlayerErrorString(data, playerId)); };
        if (player._id && !playerRef.current) {
            onPlayerId && onPlayerId(player);
            playerRef.current = true;
        };
    }, [playerId, onPlayerId, playerRef]);

    const { data: playerState, isLoading, isError } = useQuery<IPlayer, unknown, IPlayer, QueryKey>([
        'player',
        { endPoint: STATE_QUERY, id: playerId, }
    ], stateFetch,
        {
            enabled: !!playerId,
            keepPreviousData: !!playerId,
            onSuccess,
        },
    );

    return {
        playerState,
        playerId: playerState?._id,
        playerLoading: isLoading,
        playerError: isError
    }
};
