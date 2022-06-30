import { LoadingOverlay } from "@mantine/core";
import { useEffect } from "react";
import usePlayerState from "../../shared/hooks/player/usePlayerState";
import useNewGame from "./hooks/useNewGame";
import useNewPlayer from "./hooks/useNewPlayer";
import NameEntry from "./nameEntry";

export default function NewSession() {
    const { submitNewPlayer, playerLoading } = useNewPlayer();
    // const { joinOrCreateGame, gameLoading } = useNewGame();
    // usePlayerState({ onPlayerId: joinOrCreateGame });

    return (
        <>
            <LoadingOverlay visible={playerLoading
                // || gameLoading
            } />
            <NameEntry submitNewPlayer={submitNewPlayer} />
        </>
    )
}