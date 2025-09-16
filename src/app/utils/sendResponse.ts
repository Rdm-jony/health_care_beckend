import { Response } from "express"

interface TMeta {
    page: number;
    limit: number;
    totalPage: number;
    total: number
}

interface ResponseData<T> {
    success: boolean,
    message: string,
    statusCode: number,
    data: T[] | T,
    meta?: TMeta
}
export const sendResponse = <T>(res: Response, data: ResponseData<T>) => {
    return res.status(data.statusCode).json({
        data: data.data,
        message: data.message,
        statusCode: data.statusCode,
        success: data.success,
        meta: data.meta
    })
}