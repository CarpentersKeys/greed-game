import { TObjectId } from "../models/typeCheckers";

export interface IMutationVariables<TPostData = any> {
    endPoint: string;
    postData?: TPostData;
    id?: TObjectId
}

export default function makeMutationFn(path: string) {
    return (
        async function mutationFn(mutationVariables: IMutationVariables) {
            const { endPoint, id } = mutationVariables;
            const resp = await fetch(`/api/${path}/${JSON.stringify(mutationVariables)}`);
            const jResp = await resp.json();
            if (resp.ok) { return jResp; } else {
                throw new Error(`mutationFn targeting endPoint: ${endPoint}, 
                \npath: /api/${path} got a bad response back for id: ${id}
                \nerrorMessage: ${jResp.errorMessage}`);
            };
        }
    )
}