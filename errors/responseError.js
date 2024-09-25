import {CustomError} from "./customError.js";

export class ResponseError extends CustomError {
    constructor(message) {
        super(message, 418, "False Information");
    }
}