import { useContext, useEffect } from "react";
import { AppContext } from "../context/playerContext";
import useNewGame from "./game/useNewGame";
import useNewPlayer from "./player/useNewPlayer";

export default function useNewSesssion() {
    const { appState } = useContext(AppContext);
    const { playerId, gameId } = appState;

    const joinOrCreateGame = useNewGame();
    const submitNewPlayer = useNewPlayer();
    useEffect(() => { if (playerId) { joinOrCreateGame(playerId); } }, [playerId])

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