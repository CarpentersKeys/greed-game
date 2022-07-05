import { useCallback } from "react";
import { IMutationVariables } from "../../fetchers/makeMutationFn";

type TQueryCallback<TData> = ((data: TData, variables?: IMutationVariables) => void)

export default function useOnSuccess<TData>(callbacks: TQueryCallback<TData>[]): (data: TData, variables?: IMutationVariables) => void {

    return useCallback(
        (data: TData, variables?: IMutationVariables) => {
            callbacks.forEach((cb) => cb(data, variables));

        }, [callbacks])
}