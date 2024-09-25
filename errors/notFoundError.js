// const { CustomError } = require("./customError");
import { CustomError } from "./customError.js";

export const NotFoundError = class NotFoundError extends CustomError{
    constructor(message){
        super(message, 404, "Not Found Error");
    }
}