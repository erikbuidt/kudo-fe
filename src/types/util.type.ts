export interface SuccessResponseApi<Data> {
    status: number
    code: string
    data: Data
}
export interface ErrorResponseApi<Data> {
    message: string
    statusCode: number
    data?: Data
}