import { NextApiResponse } from "next";

interface IParamsTotal {
    value: unknown,
    evaluator: string | ((a: unknown | unknown[]) => boolean | undefined),
    apiPath: string,
    endPoint: string,
    resp: NextApiResponse<{ errorMessage: string }>,
}

interface IParamsPartial {
    value?: unknown,
    evaluator?: string | ((a: any | any[]) => boolean | undefined),
    apiPath?: string,
    endPoint?: string,
    resp?: NextApiResponse<{ errorMessage: string }>,
}

export type TValCurry = (params: IParamsPartial) => TValCurry

export function validateTypeAndErrorIfFail(params: IParamsTotal): NextApiResponse | boolean | void;
export function validateTypeAndErrorIfFail(params: IParamsPartial): TValCurry;
export function validateTypeAndErrorIfFail(
    params: IParamsTotal | IParamsPartial): NextApiResponse | boolean | void | TValCurry {
    const { value, evaluator, apiPath, endPoint, resp } = params;

    const hasAllParams = ['value', 'evaluator', 'apiPath', 'endPoint', 'resp']
        .every(param => param in params)
    if (!hasAllParams || !resp) {
        // missing params, return our validatorFN loaded with the ones we have so far
        return ((newParams: IParamsPartial | IParamsTotal) =>
            validateTypeAndErrorIfFail({ ...newParams, ...params })
        )
    }

    let valuation;
    let evalName = '!';
    if (typeof evaluator === 'string') {
        valuation = !value;
    } else if (typeof evaluator === 'function') {
        evalName = evaluator?.name;
        valuation = !evaluator(value);
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