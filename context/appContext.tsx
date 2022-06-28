import { createContext, Dispatch, ReactNode, SetStateAction } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { TObjectId } from "../models/typeCheckers";

export interface IAppState {
    playerId?: TObjectId | null,
    gameId?: TObjectId | null,
    cleanupFns: ((a?: any) => void)[],
    // TODO specify any
}

export interface IAppContext {
    appState: IAppState,
    appStateSet: Dispatch<SetStateAction<IAppState>> | null
}

export const AppContext = createContext<IAppContext>({
    appState: {
        playerId: null,
        gameId: null,
        cleanupFns: [],
    },
    appStateSet: null,
});

export const AppContextProv = ({ children }: { children: ReactNode }) => {
  return <AppContext.Provider value={useAppContext()}>{children}</AppContext.Provider>
}