function createErrorResponse(res, statusCode, message) {
    return res.status(statusCode).json({
        status: 'error',
        message
    });
}

export default createErrorResponse;
