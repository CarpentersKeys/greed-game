import { createContext, Dispatch, SetStateAction } from "react";
import { IPlayerUpdate } from "../models/player/types";
import { TObjectId } from "../models/typeCheckers";

// interface IPlayerControlContext {
//     playerId: TObjectId | null
//     submitNewPlayer: ((a: string) => void) | null
//     deletePlayer: (() => void) | null
//     assignRoles: ((a: TObjectId) => void) | null
//     updatePlayerState: ((a: IPlayerUpdate) => void) | null
// }

// export const PlayerControlContext = createContext<IPlayerControlContext>({
//     playerId: null,
//     submitNewPlayer: null,
//     deletePlayer: null,
//     assignRoles: null,
//     updatePlayerState: null,
// })

export interface IAppState {
    playerId?: TObjectId | null,
    gameId?: TObjectId | null,
    cleanupFns: ((a?: any) => void)[],
    // TODO specify any
}

export interface IAppContext {
    appState: IAppState,
    appStateSet: Dispatch<SetStateAction<IAppState>>
}

export const AppContext = createContext<IAppContext>({
    appState: {
        playerId: null,
        gameId: null,
        cleanupFns: [],
    },
    appStateSet: () => { },
});