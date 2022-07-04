import { useCallback } from "react";
import { IMutationVariables } from "../../fetchers/makeMutationFn";

type TQueryCallback<TData> = ((data: TData, variables?: IMutationVariables) => void)

export default function useOnSuccess<TData>(callbacks: TQueryCallback<TData>[]): (data: TData, variables?: IMutationVariables) => void {

    return useCallback(
        (data: TData, variables?: IMutationVariables) => {
            console.log('useCallback test', `callbacks: ${callbacks}\ndata:${data}\nvariables: ${variables}`)
            callbacks.forEach((cb) => cb(data, variables));

        }, [...callbacks])
}