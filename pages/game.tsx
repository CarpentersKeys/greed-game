import { useContext, useEffect } from "react";
import { AppContext, useAppContext } from "../context/appContext";
import useGameState from "../components/shared/hooks/game/useGameState";
import GreedyContainer from "../components/game/greedy/greedyContainer";
import TimerContainer from "../components/game/timer/timerContainer";
import { useRouter } from "next/router";
import usePlayerState from "../components/shared/hooks/player/usePlayerState";

const Game = () => {
    const { gameId, playerId } = useAppContext();
    const { playerState } = usePlayerState();
    const router = useRouter();
    useEffect(() => {
        // TODO: fix this garbage and make page change/endSession button disapear at the same time
        // let timer: ReturnType<typeof setTimeout>;
        if (!gameId || !playerId) {
            // timer = setTimeout(() => {
            router.push('/');
            // }, 100)
        }
        // return () => { clearTimeout(timer) }
    }, [gameId, playerId, router])

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