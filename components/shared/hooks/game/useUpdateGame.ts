import { returnGame } from "../../../../models/typeCheckers";
import { useCallback } from "react";
import { UPDATE_STATE } from "../../../../lib/famousStrings";
import makeMutationFn, { IMutationVariables } from "../../../../fetchers/makeMutationFn";
import { useMutation } from "react-query";
import { useAppContext } from "../../../../context/appContext";
import { IGame } from "../../../../models/game/types";

const functionName = useUpdateGame.name;
export default function useUpdateGame() {
    const { gameId } = useAppContext();
    const onSuccess = useCallback((data: IGame) => {
        const game = returnGame(data);
        if (!game) { throw new Error(`Server did\'nt return a player to ${functionName}. \nData: ${data}`); };
    }, [])

    const { mutate: mutateGame, isLoading: updateLoading }
        = useMutation<IGame, unknown, IMutationVariables, unknown>(
            makeMutationFn('game'), { onSuccess })

    const updateGame = useCallback((updateObj: Partial<IGame>) => {
        mutateGame({ endPoint: UPDATE_STATE, id: gameId, postData: updateObj });
    }, [gameId, mutateGame]);

    return { updateGame, updateLoading };
}