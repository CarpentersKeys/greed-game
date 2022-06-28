import { useState } from "react";
import { IAppState } from "../context/appContext";

export const useAppContext = () => {
    const [appState, appStateSetPre] = useState<IAppState>({
        playerId: null,
        gameId: null,
        cleanupFns: [],
    });
    const appStateSet = (a: any) => {
        appStateSetPre(a);
    }

    return {
        appState, appStateSet
    }
}