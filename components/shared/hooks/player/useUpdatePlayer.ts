import { returnPlayer } from "../../../../models/typeCheckers";
import { useCallback } from "react";
import { UPDATE_STATE } from "../../../../lib/famousStrings";
import makeMutationFn, { IMutationVariables } from "../../../../fetchers/makeMutationFn";
import { useMutation } from "react-query";
import { useAppContext } from "../../../../context/appContext";
import { IPlayer } from "../../../../models/player/types";
import { queryClient } from "../../../../pages/_app";

const functionName = useUpdatePlayer.name;
export default function useUpdatePlayer() {
    const { playerId } = useAppContext();
    const onSuccess = useCallback((data: IPlayer) => {
        const player = returnPlayer(data);
        if (!player) { throw new Error(`Server did\'nt return a player to ${functionName}. \nData: ${data}`); };
    }, [])
    const onMutate = useCallback((postObj: IMutationVariables) => {
        const newData = postObj.postData;
        const previousPlayerState = returnPlayer(queryClient.getQueryData('player'));
        if (previousPlayerState) {
            const copy = { ...previousPlayerState };
            const updatedData = Object.assign(copy, newData);
            queryClient.setQueryData('player', { updatedData });
            return { updatedData };
        }
        queryClient.setQueryData('player', { update: newData });
        return { update: newData };
    }, [])

    const { mutate: mutatePlayer, isLoading: updateLoading, reset }
        = useMutation<IPlayer, unknown, IMutationVariables, unknown>(
            makeMutationFn('player'), {
            onSuccess,
            onMutate,
            onSettled() { queryClient.invalidateQueries('player') },
            onError() {
                queryClient.setQueryData('player', null)
                reset();
            }
        })

    const updatePlayer = useCallback((updateObj: Partial<IPlayer>) => {
        mutatePlayer({ endPoint: UPDATE_STATE, id: playerId, postData: updateObj });
    }, [playerId, mutatePlayer]);

    return { updatePlayer, updateLoading };
}