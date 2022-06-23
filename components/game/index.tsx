import { useEffect } from "react";
import { UseQueryResult } from "react-query";
import { IGame, IGameUpdate } from "../../models/game/types";
import { IPlayer, IPlayerUpdate } from "../../models/player/types";
import { TObjectId } from "../../models/typeCheckers";

interface IAppProps {
    usePlayerStateResult: UseQueryResult<IPlayer>;
    useGameStateResult: UseQueryResult<IGame>;
    updatePlayerState: (updatedPlayer: IPlayerUpdate) => void;
    updateGameState: (updatedGame: IGameUpdate) => void;
    assignRoles: (playerId: TObjectId) => void;
}

// type TGame = (props: IAppProps) => JSX.Element
export default function Game(props: IAppProps): JSX.Element {
    const { usePlayerStateResult, useGameStateResult, updatePlayerState, updateGameState, assignRoles } = props;
    const { data: playerState, refetch: refetchPlayerState } = usePlayerStateResult;
    const { data: gameState, refetch: refetchChangeState } = useGameStateResult;

    useEffect(() => {
        if (playerState && !playerState?.inGame && gameState?._id) {
            updatePlayerState({ _id: playerState._id, inGame: gameState?._id })
        }
        // dangerous use of undefined, reason: schema can only have one schemaType and inGame should be ObjectId
        return () => playerState?.id && playerState?.inGame && updatePlayerState({ _id: playerState._id, inGame: undefined});
    }, [])
    // updateGameState()
    // updatePlayerState()
    return (
        <></>
    )
}