export const successResponse = <T>(status: number, message: string, data: T): { status: number, success: boolean, message: string, data: T } => {
    return {
        status: status,
        success: true,
        message: message,
        data: data
    }
}

export const errorResponse = <T>(status: number, message: string, error: T): { status: number, success: boolean, message: string, error: T } => {
    return {
        status: status,
        success: false,
        message: message,
        error: error 
    }
}