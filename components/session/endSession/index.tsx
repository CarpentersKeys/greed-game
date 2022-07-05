import { Box, Button, LoadingOverlay } from "@mantine/core";
import { useEffect, useState } from "react";
import useGameState from "../../shared/hooks/game/useGameState";
import useDeletePlayer from "./hooks/useDeletePlayer";
import useRemovePlayerFromGame from "./hooks/useRemovePlayerFromGame";

export default function EndSessionButton() {
    const { removePlayerFromGame, removalLoading } = useRemovePlayerFromGame();
    const { deletePlayer, deletePlayerLoading } = useDeletePlayer();
    useGameState({ onGameIdDrop: deletePlayer });

    return (
        <>
            {/* <LoadingOverlay transitionDuration={400} visible={deletePlayerLoading || removalLoading} /> */}
            <Box><Button onClick={() => removePlayerFromGame()}>End Session</Button></Box>
        </>
    )
}