import { useCallback } from "react";
import { IMutationVariables } from "../../fetchers/makeMutationFn";

export function validateData<T>(
    evaluator: (data: unknown) => data is T, errorData: {},
) {
    return ((data: unknown, variables?: IMutationVariables) => {
        if (!evaluator(data)) {
            throw new Error(`error: 
        \ndata passed with callback: ${JSON.stringify(errorData)} 
        \nvariables from mutation: ${variables && JSON.stringify(variables)}`);
        } else { return data as T; };
    })
}


type TQueryCallback<TData> = ((data: TData, variables?: IMutationVariables) => void)

export default function useOnSuccess<TData>(callbacks: TQueryCallback<TData>[]): (data: TData, variables?: IMutationVariables) => void {

    return useCallback(
        (data: TData, variables?: IMutationVariables) => {
            console.log('useCallback test', `callbacks: ${callbacks}\ndata:${data}\nvariables: ${variables}`)
            callbacks.forEach((cb) => cb(data, variables));

        }, [...callbacks])
}