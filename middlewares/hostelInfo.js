import { ResponseError } from "../errors/responseError";

export const getUserInfo = async (req, res, next) => {
    try {
        const user = await getOnestopUser(req.headers.authorization, req.headers['security-key']);
        if (user.subscribedHostel === req.body.hostel) {
            next();
        } else {
            next(new ResponseError("Hostel doesn't match"));
         }
    } catch (e) {
        next(e);
    }
}