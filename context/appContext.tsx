import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext } from "react";
import { TObjectId } from "../models/typeCheckers";
import { useState } from "react";


export const AppContext = createContext<IAppContext | undefined>(undefined);

export const AppContextProv = ({ children }: { children: ReactNode }) => {
    const [appState, appStateSet] = useState<IAppState>({
        playerId: null,
        gameId: null,
        cleanupFns: [],
    });

    const updateAppState = useCallback((update: IAppStateUpdate) => {
        // update helper so you can just submit the values you want updated
        appStateSet((prev) => {
            const copy = { ...prev };
            copy.cleanupFns = [copy.cleanupFns].flat();
            // add new cleanup functions or reset to empty array
            if (update.cleanupFns === null || update?.cleanupFns?.length === 0) {
                update.cleanupFns = [];
            } else if (Array.isArray(update.cleanupFns)) {
                update.cleanupFns = [...copy.cleanupFns, ...update.cleanupFns];
            } else if (update?.cleanupFns) {
                copy.cleanupFns.push(update.cleanupFns);
            }
            return Object.assign(copy, update)
        });
    }, [appStateSet])

    const contextVal = {
        ...appState, appState, updateAppState
    }

    return <AppContext.Provider value={contextVal}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
    const appStateResult = useContext(AppContext);
    if (appStateResult === undefined) { throw new Error('App context used outside provider') }
    return (appStateResult);
}

export interface IAppState {
    playerId: TObjectId | null,
    gameId: TObjectId | null,
    cleanupFns: (() => void)[],
    // TODO specify any
}

interface IAppContext {
    appState: IAppState,
    playerId: TObjectId | null,
    gameId: TObjectId | null,
    cleanupFns: (() => void)[],
    updateAppState: (update: IAppStateUpdate) => void
    // TODO specify any
}

export interface IAppStateUpdate {
    playerId?: TObjectId | null,
    gameId?: TObjectId | null,
    cleanupFns?: (() => void)[] | (() => void),
    // TODO specify any
}