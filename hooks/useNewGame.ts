import { ObjectId } from "mongoose";
import { useEffect, useRef } from "react";
import { useMutation } from "react-query";
import { IGame } from "../models/game/types";

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

export default function useNewGame(newPlayerId: ObjectId | undefined | null) {
    const playerId = useRef<ObjectId | null>(null);
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
    } = useMutation<ObjectId, unknown, ObjectId, unknown>(mutationFn);

    return { newGameId, gameReset, submitNewGame, ...rest };
}