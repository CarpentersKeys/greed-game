import { useEffect, useRef } from "react";
import { useMutation } from "react-query";
import makeMutationFn from "../fetchers/makeMutationFn";
import { TObjectId } from "../models/typeCheckers";

export default function useMutateGame(newPlayerId: TObjectId | undefined | null) {
    const playerId = useRef<TObjectId | null>(null);
    useEffect(() => {
        if (playerId.current !== newPlayerId) {
            if (newPlayerId) {
                playerId.current = newPlayerId;
                joinOrCreateGame(newPlayerId);
            } else {
                gameReset();
            }
        }
    }, [newPlayerId]);

    const {
        reset: gameReset,
        data: newGameId,
        mutate,
        ...rest
    } = useMutation<TObjectId, unknown, {endPoint: string, postData: any}, unknown>(makeMutationFn('game'));


    function joinOrCreateGame(playerId: TObjectId) { mutate({ endPoint: 'joinOrCreate', postData: playerId }); };
    function removePlayerFromGame(playerId: TObjectId) { mutate({ endPoint: 'removePlayer', postData: playerId }); };

    return {
        newGameId,
        gameReset,
        joinOrCreateGame,
        removePlayerFromGame,
        ...rest
    };
}