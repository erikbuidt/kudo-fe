export interface SuccessResponseApi<Data> {
    message: string
    statusCode: number
    data: Data
}
export interface ErrorResponseApi<Data> {
    message: string
    statusCode: number
    data?: Data
}