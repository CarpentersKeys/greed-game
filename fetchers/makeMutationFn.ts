interface IMutationVariables <TPostData = any>{
    endPoint: string;
    postData: TPostData;
}

export default function makeMutationFn(key: string) {
return (
    async function mutationFn(mutationVariables: IMutationVariables) {
            const { endPoint } = mutationVariables
            // const postObj = { endPoint, postData };
            const resp = await fetch(`/api/${key}/${JSON.stringify(mutationVariables)}`);
            const jResp = await resp.json();
            if (resp.ok) {
                return jResp;
            } else {
                throw new Error(`${endPoint} ${key} mutation got a bad response back\nerrorMessage: ${jResp.errorMessage}`);
            };
        }
    )
}