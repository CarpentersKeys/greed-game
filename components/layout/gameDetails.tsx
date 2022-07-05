import { Group, LoadingOverlay } from "@mantine/core";
import { useAppContext } from "../../context/appContext";
import useGameState from "../shared/hooks/game/useGameState";

export default function GameDetails(): JSX.Element {
    const { gameLoading, gameState } = useGameState();

    return (
        <>

            {/* <LoadingOverlay visible={gameLoading && !gameState} /> */}
            {
                gameState &&
                <Group>
                    <span>Score: {JSON.stringify(gameState.score) || '0:0'}</span>
                    <span>Stage: {gameState.gameStage && gameState.gameStage} </span>
                </Group>
            }
        </>
    )
}
