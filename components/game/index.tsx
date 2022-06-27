import { useContext, useEffect } from "react";
import { AppContext } from "../../context/playerContext";
import useGameState from "../../hooks/game/useGameState";
import usePlayerState from "../../hooks/player/usePlayerState";
import { isPlayer, } from "../../models/typeCheckers";
import GreedyContainer from "./greedy/greedyContainer";
import TimerContainer from "./timer/timerContainer";

const Game = () => {
    const { appState, appStateSet } = useContext(AppContext)
    const { playerId, gameId } = appState;
    const { data: playerState, refetch: refetchPlayerState } = usePlayerState(playerId);
    const { data: gameState, refetch: refetchChangeState } = useGameState(gameId);
    useEffect(() => {
        const update = { ...appState };
        update.gameId = playerState?.inGame;
        appStateSet(update);
    }, [playerState]);

    // useEffect(() => {
    //     if (playerState && !playerState?.inGame && gameState?._id && updatePlayerState) {
    //         updatePlayerState({ _id: playerState?._id, inGame: gameState?._id })
    //     }
    //     // dangerous use of undefined, reason: schema can only have one schemaType and inGame should be ObjectId
    //     // currently not needed because the 
    //     return () => { isPlayer(playerState) && updatePlayerState && updatePlayerState({ _id: playerState._id, inGame: undefined }) };
    // }, [])
    // updateGameState()
    // updatePlayerState()
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