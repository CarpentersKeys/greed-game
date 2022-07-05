import { Dispatch, SetStateAction, useEffect } from "react";
import { EGameStage } from "../../../models/game/types";
import useGameState from "../../shared/hooks/game/useGameState"
import TimerSet from "./timerSet";


export default function TimerPlayer({ loadingSet }: { loadingSet: Dispatch<SetStateAction<boolean>> }): JSX.Element {
    const { gameState } = useGameState();
    const gameStage = gameState?.gameStage;

    return (
        <>
            {gameStage === EGameStage.TIMER_SET && <TimerSet loadingSet={loadingSet}/>}
            {/* {gameStage === EGameStage.TIMER_RUN && <TimerRun loadingSet={loadingSet}/>} */}
            {/* {gameStage === EGameStage.ROUND_CONCLUDE && <RoundConclude loadingSet={loadingSet}/>} */}
        </>
    )
}