export default function makeMutationFn(key: string, endPoint: string) {
    return (
        async function mutationFn(postData: unknown) {
            const postObj = { endPoint, postData };
            const resp = await fetch(`/api/${key}/${JSON.stringify(postObj)}`);
            const jResp = await resp.json();
            if (resp.ok) {
                return jResp;
            } else {
                throw new Error(`${endPoint} ${key} mutation got a bad response back\nerrorMessage: ${jResp.errorMessage}`);
            };
        }
    )
}