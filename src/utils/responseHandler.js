export class AppResponse {
    constructor(message, data = null, statusCode , dataName) {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.dataName = dataName;
    }
}

export const globalSuccessHandler = (result, req, res) => {
    const response = { message: result.message };
    if (result.data !== null && result.data !== undefined) {
        response[result.dataName] = result.data;
    }
    return res.status(result.statusCode).json(response);
};

