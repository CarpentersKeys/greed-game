import { useEffect } from "react";
import { UseQueryResult } from "react-query";
import { IGame, IGameUpdate } from "../../models/game/types";
import { IPlayer, IPlayerUpdate } from "../../models/player/types";

interface IAppProps {
    usePlayerStateResult: UseQueryResult<IPlayer>;
    useGameStateResult: UseQueryResult;
    updatePlayerState: (updatedPlayer: IPlayerUpdate) => void;
    updateGameState: (updatedGame: IGameUpdate) => void;
}

// type TGame = (props: IAppProps) => JSX.Element
export default function Game(props: IAppProps): JSX.Element {
    const { usePlayerStateResult, useGameStateResult, updatePlayerState, updateGameState } = props;
    const { data: playerState, refetch: refetchPlayerState } = usePlayerStateResult;
    const { data: gameState, refetch: refetchChangeState } = useGameStateResult;

    useEffect(() => {
        if (playerState && !playerState?.inGame) {
            updatePlayerState({ _id: playerState._id, inGame: true });
        }
        return () => playerState?.id && playerState?.inGame && updatePlayerState({ _id: playerState._id, inGame: false });
    }, [])
    // updateGameState()
    // updatePlayerState()
    return (
        <></>
    )
}
