import { JOIN_OR_CREATE_GAME } from "../lib/famousStrings";

interface IMutationVariables<TPostData = any> {
    endPoint: string;
    postData: TPostData;
}

export default function makeMutationFn(path: string) {
    return (
        async function mutationFn(mutationVariables: IMutationVariables) {
            const { endPoint } = mutationVariables
            // const postObj = { endPoint, postData };
            const resp = await fetch(`/api/${path}/${JSON.stringify(mutationVariables)}`);
            const jResp = await resp.json();
            if (resp.ok) {
                return jResp;
            } else {
                throw new Error(`mutationFn targeting endPoint: ${endPoint}, path: /api/${path} got a bad response back\nerrorMessage: ${jResp.errorMessage}`);
            };
        }
    )
}