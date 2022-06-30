import { Box, Button, LoadingOverlay } from "@mantine/core";

export default function EndSessionButton() {
    const { removePlayerFromGame, removalLoading } = useRemovePlayerFromGame();
    const { deletePlayer, deletionLoading } = useDeletePlayer();
    useGameState({ onGameIdDrop: deletePlayer });

    return (
        <>
            <LoadingOverlay visible={deletionLoading || removalLoading} />
            return <Box><Button onClick={() => removePlayerFromGame()}>End Session</Button></Box>
        </>
    )
}