const ERROR_CODES = {
    GENERAL: 'GENERAL',
    NOT_FOUND: 'NOT_FOUND',
    MISSING_DATA: 'MISSING_DATA',
    INVALID_DATA: 'INVALID_DATA',
    EXPIRED_TOKEN: 'EXPIRED_TOKEN',
    INVALID_TOKEN: 'INVALID_TOKEN',
    BAD_REQUEST: 'BAD_REQUEST'
}

class SuccessResponse {
    constructor(data) {
        this.status = 'ok'
        this.data = data || {}
    }
}

class ErrorResponse {

    constructor(message, errorCode = ERROR_CODES.GENERAL, data) {
        this.status = 'error'
        this.errorMessage = message || ''
        this.errorCode = errorCode
        this.data = data || {}
    }
}

class HTTPError extends Error {

    constructor(message = 'Error', status = 500, errorCode = ERROR_CODES.GENERAL, fileName, lineNumber) {
        super(message, fileName, lineNumber)
        this.status = status
        this.code = errorCode
    }
}

class BadRequestError extends Error{

    constructor(message = 'Error', status = 400, errorCode = ERROR_CODES.BAD_REQUEST, fileName, lineNumber) {
        super(message, fileName, lineNumber)
        this.status = status
        this.code = errorCode
    }
}

module.exports = {
    SuccessResponse,
    ErrorResponse,
    HTTPError,
    BadRequestError,
    ERROR_CODES,
}