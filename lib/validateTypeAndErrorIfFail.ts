import { NextApiResponse } from "next";

interface IParamsTotal<T> {
    value: T,
    evaluator: string | ((a: T | T[]) => boolean | undefined),
    apiPath: string,
    endPoint: string,
    resp: NextApiResponse<{ errorMessage: string }>,
}

interface IParamsPartial {
    value?: unknown,
    evaluator?: string | ((a: any| any[]) => boolean | undefined),
    apiPath?: string,
    endPoint?: string,
    resp?: NextApiResponse<{ errorMessage: string }>,
}

export type TValCurry = <T>(params: IParamsPartial) => TValCurry

export function validateTypeAndErrorIfFail<T>(params: IParamsTotal<T>): NextApiResponse | boolean | void;
export function validateTypeAndErrorIfFail<T>(params: IParamsPartial): TValCurry;
export function validateTypeAndErrorIfFail<T>(
    params: IParamsTotal<T> | IParamsPartial): NextApiResponse | boolean | void | TValCurry {
    const { value, evaluator, apiPath, endPoint, resp } = params;

    const hasAllParams = ['value', 'evaluator', 'apiPath', 'endPoint', 'resp']
        .every(param => param in params)
    if (!hasAllParams || !resp) {
        // missing params, return our validatorFN loaded with the ones we have so far
        return ((newParams: IParamsPartial | IParamsTotal<T>) =>
            validateTypeAndErrorIfFail<T>({ ...newParams, ...params })
        )
    }

    let valuation;
    let evalName = '!';
    if (typeof evaluator === 'string') {
        valuation = !value;
    } else if (typeof evaluator === 'function') {
        evalName = evaluator?.name;
        valuation = !evaluator(value as T);
    };

    if (valuation) {
        resp.status(500)
            .json({
                errorMessage: `from /api/${apiPath} endPoint: ${endPoint}
                \nfailed: ${evalName}(${JSON.stringify(value)})`
            });
        return true;
    }
    return false;
}