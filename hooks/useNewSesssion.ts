import { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import useNewGame from "./game/useNewGame";
import useNewPlayer from "./player/useNewPlayer";
import usePlayerState from "./player/usePlayerState";

export default function useNewSesssion() {
    const { appState } = useContext(AppContext);
    const { playerId, gameId } = appState;
    const joinOrCreateGame = useNewGame();
    const submitNewPlayer = useNewPlayer();

    useEffect(() => {
        if (appState.playerId) {
            joinOrCreateGame(appState.playerId);
        }
    }, [appState])

    function submitNewSession(name: string): void {
        if (!playerId && !gameId) {
            submitNewPlayer(name);
        } else {
            throw new Error(
                `useNewSession can\'t create a new session because a current session exists
                \n${playerId && `playerId: ${playerId}`}
                \n${gameId && `playerId: ${gameId}`}
        `)
        }
    };

    return submitNewSession;
}