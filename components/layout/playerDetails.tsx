import { Group, LoadingOverlay } from "@mantine/core";
import usePlayerState from "../shared/hooks/player/usePlayerState"

export default function PlayerDetails(): JSX.Element {
    const { playerLoading, playerState } = usePlayerState();
    console.log(playerLoading)

    return (
        <>
            {/* <LoadingOverlay visible={playerLoading && !playerState} /> */}
            {
                playerState &&
                <Group>
                    <span>{playerState.name}</span>
                    <span>{playerState.gameRole && playerState.gameRole}</span>
                </Group>
            }
        </>

    )
}