
import useGameState from "../../shared/hooks/game/useGameState";
import useUpdateGame from "../../shared/hooks/game/useUpdateGame";

export default function TimerRun(): JSX.Element {
    const { gameState } = useGameState();
    const { updateGame } = useUpdateGame();

    return (
        <>
        </>
    )
}