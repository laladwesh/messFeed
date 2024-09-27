import { Router } from 'express';
import { Response } from '../models/response';
import { verifyUserInfo } from '../middlewares/userInfo';
import { opiController } from '../controller/opiController';

export const router = Router();


router.get("/" , (req , res) => {
    res.json("Connected to server");
})

router.post("/new" , verifyUserInfo , opiController.createNew);
