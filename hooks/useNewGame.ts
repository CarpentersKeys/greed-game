import { useEffect, useRef } from "react";
import { useMutation } from "react-query";
import makeMutationFn from "../fetchers/makeMutationFn";
import { TObjectId } from "../models/typeCheckers";

export default function useNewGame(newPlayerId: TObjectId | undefined | null) {
    const playerId = useRef<TObjectId | null>(null);
    useEffect(() => {
        if (playerId.current !== newPlayerId) {
            if (newPlayerId) {
                playerId.current = newPlayerId;
                submitNewGame(newPlayerId);
            } else {
                gameReset();
            }
        }
    }, [newPlayerId])

    const {
        reset: gameReset,
        data: newGameId,
        mutate: submitNewGame,
        ...rest
    } = useMutation<TObjectId, unknown, TObjectId, unknown>(makeMutationFn('game', 'joinOrCreate'));

    return { newGameId, gameReset, submitNewGame, ...rest };
}