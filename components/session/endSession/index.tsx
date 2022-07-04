import { Box, Button, LoadingOverlay } from "@mantine/core";
import useGameState from "../../shared/hooks/game/useGameState";
import useDeletePlayer from "./hooks/useDeletePlayer";
import useRemovePlayerFromGame from "./hooks/useRemovePlayerFromGame";

export default function EndSessionButton() {
    const { removePlayerFromGame, removalLoading } = useRemovePlayerFromGame();
    const { deletePlayer, deletePlayerLoading } = useDeletePlayer();
    useGameState({ onGameIdDrop: deletePlayer });

    return (
        <>
            <LoadingOverlay visible={deletePlayerLoading || removalLoading} />
            <Box><Button onClick={() => removePlayerFromGame()}>End Session</Button></Box>
        </>
    )
}