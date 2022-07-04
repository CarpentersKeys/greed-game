import { LoadingOverlay } from "@mantine/core";
import { IPlayer } from "../../../models/player/types";
import usePlayerState from "../../shared/hooks/player/usePlayerState";
import useNewGame from "./hooks/useNewGame";
import useNewPlayer from "./hooks/useNewPlayer";
import NameEntry from "./nameEntry";

export default function NewSession() {
    const { submitNewPlayer, playerLoading } = useNewPlayer();
    const { joinOrCreateGame, gameLoading } = useNewGame();
    usePlayerState({ onPlayerId: (player: IPlayer) => joinOrCreateGame(player._id) });

    return (
        <>
            <LoadingOverlay transitionDuration={400} visible={playerLoading
                || gameLoading
            } />
            <NameEntry submitNewPlayer={submitNewPlayer} />
        </>
    )
}