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
            endPoint === JOIN_OR_CREATE_GAME && console.log('prefetch', path, 'postObj: ', mutationVariables)
            const resp = await fetch(`/api/${path}/${JSON.stringify(mutationVariables)}`);
            endPoint === JOIN_OR_CREATE_GAME && console.log('json of resp in makeMutation: ', resp)
            const jResp = await resp.json();
            endPoint === JOIN_OR_CREATE_GAME && console.log('json of resp in makeMutation: ', jResp)
            if (resp.ok) {
                endPoint === JOIN_OR_CREATE_GAME && console.log(`successful mutation ${path}, ${JSON.stringify(mutationVariables)}, ${JSON.stringify(jResp)}`)
                return jResp;
            } else {
                endPoint === JOIN_OR_CREATE_GAME && console.log('postfetch', path, 'postObj: ', mutationVariables)
                throw new Error(`mutationFn targeting endPoint: ${endPoint}, path: /api/${path} got a bad response back\nerrorMessage: ${jResp.errorMessage}`);
            };
        }
    )
}