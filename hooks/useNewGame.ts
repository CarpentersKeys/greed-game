import { useEffect, useRef } from "react";
import { useMutation } from "react-query";
import { ObjectId, TObjectId } from "../models/typeCheckers";

async function mutationFn(playerId: ObjectId) {
    const postObj = { endPoint: 'get', postData: playerId };
    const resp = await fetch(`/api/game/${JSON.stringify(postObj)}`);
    if (resp.ok) {
        return await resp.json();
    } else {
        const problem = await resp.text()
        throw new Error(`new game mutation got a bad response back: raw:${problem}`);
    };
}

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
    } = useMutation<TObjectId, unknown, TObjectId, unknown>(mutationFn);

    return { newGameId, gameReset, submitNewGame, ...rest };
}