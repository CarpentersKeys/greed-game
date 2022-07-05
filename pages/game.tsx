import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import GreedyContainer from "../components/game/greedy/greedyContainer";
import TimerContainer from "../components/game/timer";
import { useRouter } from "next/router";
import usePlayerState from "../components/shared/hooks/player/usePlayerState";
import useGameState from "../components/shared/hooks/game/useGameState";
import { EGameStage } from "../models/game/types";
import useUpdateGame from "../components/shared/hooks/game/useUpdateGame";
import { EGameRoles, IPlayer } from "../models/player/types";
import { LoadingOverlay } from "@mantine/core";
import { useMutation } from "react-query";
import { ASSIGN_ROLES } from "../lib/famousStrings";
import { returnPlayer } from "../models/typeCheckers";
import makeMutationFn, { IMutationVariables } from "../fetchers/makeMutationFn";
import { queryClient } from "./_app";

const functionName = Game.name;

function Game() {
    useGoHome();
    const { assignmentLoading, assignRoles } = useAssignRoles();
    const { playerState } = usePlayerState();
    const { gameState } = useGameState();
    const { updateGame, updateLoading } = useUpdateGame();
    const gameStage = gameState?.gameStage;
    const gameRole = playerState?.gameRole;

    useEffect(() => { gameStage === EGameStage.MATCHING && gameRole && updateGame({ gameStage: EGameStage.TIMER_SET }) },
        [gameStage, updateGame, gameRole])
    const [loading, loadingSet] = useState(false);

    useEffect(() => {
        gameStage !== EGameStage.MATCHING && (gameState?.players?.length !== 2 || !playerState?.gameRole)
            && updateGame({ gameStage: EGameStage.MATCHING })
    },
        [gameStage, updateGame, gameRole, gameState?.players.length, playerState?.gameRole])

    useEffect(() => {
        if (!playerState?.gameRole && gameState?.players?.length === 2 && gameState?.gameStage === EGameStage.MATCHING) {
            console.log('assign called')
            assignRoles();
        }
    }, [playerState, assignRoles, gameState])

    return (
        <>
            <LoadingOverlay transitionDuration={500} visible={loading || updateLoading || assignmentLoading} />
            {
                playerState?.gameRole === EGameRoles.GREEDY_PLAYER
                    ? <GreedyContainer loadingSet={loadingSet} />
                    : playerState?.gameRole === EGameRoles.TIMER_PLAYER
                        ? <TimerContainer loadingSet={loadingSet} />
                        : null
            }
        </>
    )
}

const useGoHome = () => {
    const { gameId, playerId } = useAppContext();
    const router = useRouter();
    useEffect(() => {
        if (!gameId || !playerId) {
            router.push('/');
        }
    }, [gameId, playerId, router])
}

const useAssignRoles = () => {
    const { playerState, playerId } = usePlayerState();
    const { gameState } = useGameState();
    const onSuccess = useCallback((data: IPlayer) => {
        const player = returnPlayer(data);
        if (!player) { throw new Error(`Server did\'nt return a player to ${functionName}. \nData: ${data}`); };
        queryClient.setQueryData('player', data)
        // MAKE ASSIGN ROLES OPTIMISTIC
    }, [])

    const { mutate: mutatePlayer, isLoading: assignmentLoading }
        = useMutation<IPlayer, unknown, IMutationVariables, unknown>(
            makeMutationFn('player'), { onSuccess })

    const assignRoles = useCallback(() => {
        mutatePlayer({ endPoint: ASSIGN_ROLES, id: playerId });
    }, [playerId, mutatePlayer]);

    return { assignmentLoading, assignRoles };
}

export default Game
