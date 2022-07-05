import { Group, LoadingOverlay } from "@mantine/core";
import usePlayerState from "../shared/hooks/player/usePlayerState"

export default function PlayerDetails(): JSX.Element {
    const { playerLoading, playerState } = usePlayerState();

    return (
        <>
            <LoadingOverlay visible={playerLoading && !playerState} />
            {
                playerState &&
                <Group>
                    <span>Name: {playerState.name}</span>
                    <span>Role: {playerState.gameRole && playerState.gameRole}</span>
                </Group>
            }
        </>

    )
}