import { useContext, useEffect } from "react";
import { AppContext } from "../context/appContext";
import useGameState from "../hooks/game/useGameState";
import usePlayerState from "../hooks/player/usePlayerState";
import GreedyContainer from "../components/game/greedy/greedyContainer";
import TimerContainer from "../components/game/timer/timerContainer";
import { useRouter } from "next/router";

const Game = () => {
    const { appState, appStateSet } = useContext(AppContext)
    const { gameId, playerId } = appState;
    const { data: playerState, refetch: refetchPlayerState } = usePlayerState(playerId);
    const { data: gameState, refetch: refetchChangeState } = useGameState(gameId);
    useEffect(() => {
        // derive gameId from playerState
        if (appStateSet) {
            const stateUpdate = { ...appState };
            stateUpdate.gameId = playerState?.inGame;
            appStateSet(stateUpdate);
        }
    }, [playerState]);
    const router = useRouter();
    useEffect(() => {
        // TODO: fix this garbage and make page change/endSession button disapear at the same time
        let timer: ReturnType<typeof setTimeout>;
        if (!gameId || !playerId) {
            timer = setTimeout(() => {
                router.push('/');
            }, 100)
        }
        return () => { clearTimeout(timer) }
    }, [gameId, playerId])

    return (
        <>
            {
                playerState?.gameRole === 'greedyPlayer'
                    ? <GreedyContainer />
                    : <TimerContainer />
            }
        </>
    )
}
export default Game