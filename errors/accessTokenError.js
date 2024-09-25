// const { CustomError } = require("./customError");
import { CustomError } from "./customError.js";


export const AccessTokenError = class AccessTokenError extends CustomError{
    constructor(message){
        super(message, 401, 'Token Invalid');
    }
}