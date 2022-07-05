import { returnGame } from "../../../../models/typeCheckers";
import { useCallback } from "react";
import { UPDATE_STATE } from "../../../../lib/famousStrings";
import makeMutationFn, { IMutationVariables } from "../../../../fetchers/makeMutationFn";
import { useMutation } from "react-query";
import { useAppContext } from "../../../../context/appContext";
import { IGame } from "../../../../models/game/types";
import { queryClient } from "../../../../pages/_app";

const functionName = useUpdateGame.name;
export default function useUpdateGame() {
    const { gameId } = useAppContext();
    const onSuccess = useCallback((data: IGame) => {
        const game = returnGame(data);
        if (!game) { throw new Error(`Server did\'nt return a player to ${functionName}. \nData: ${data}`); };
        queryClient.setQueryData('game', game);
    }, [])
    const onMutate = useCallback((postObj: IMutationVariables) => {
        const newGameData = postObj.postData;
        const previous = returnGame(queryClient.getQueryData('game'));
        const updatedData = Object.assign({ ...previous }, newGameData);
        queryClient.setQueryData('game', updatedData);
        return { previous }
    }, [])

    const { mutate: mutateGame, isLoading: updateLoading, reset }
        = useMutation<IGame, unknown, IMutationVariables, unknown>(
            makeMutationFn('game'), {
            onSuccess,
            onMutate,
            onSettled() { queryClient.invalidateQueries('game') },
            onError(__, _, context) {
                const previousGameState = returnGame((context as { previous: IGame })?.previous);
                queryClient.setQueryData('game', previousGameState)
                reset();
            }
        })

    const updateGame = useCallback((updateObj: Partial<IGame>) => {
        mutateGame({ endPoint: UPDATE_STATE, id: gameId, postData: updateObj });
    }, [gameId, mutateGame]);

    return { updateGame, updateLoading };
}