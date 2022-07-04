import { TEvaluator } from "./typeCheckers";

// type that takes array of types and returns 


type TEvalArr<T> = TEvaluator<T>[]
type TComposeReturn<TEAR, T extends TEvalArr<TEAR>> = [number]

// function composeEvaluators<TErr, TEvalReturn, TComposeReturn>(
//     data: unknown, evals: TEvalArr<TEvalReturn>, errorContext?: {} extends TErr 
//     ) {
//     // make get results of all evaluators against data
//     const valuations = evals.map(e => {
//         const val = e(data)
//         // error if any are falsy
//         if (!val) {
//             throw new Error(`Error in ${composeEvaluators.name} 
//         \ndata: ${data} \nevaluator: ${e.name}${errorContext && `\nerror context:${errorContext}`}`
//             )
//         }
//         return val;
//     });
//     return valuations.find(v => typeof v !== 'boolean');
// }