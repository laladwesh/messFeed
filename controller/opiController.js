import {Response} from "../models/response.js";

const createNew = async (req, res) => {
  const userCheck = Response.findById({ outlookEmail: req.body.outlookEmail });
  const {name , outlookEmail , rollNo , gender , hostel , phoneNumber , subscribedMess} = req.user.body;
  if (userCheck.filledEarlier) {
    res.json("Already filled of this month!");
  }
  await Response.create({
    name: name,
    outlookEmail: outlookEmail,
    rollNo: rollNo,
    gender: gender,
    hostel: hostel,
    phoneNumber: phoneNumber,
    opiRating: req.body.opiRating,
    opiComments: req.body.opiComments,
    subscribedMess: req.body.subscribedMess,
    month: req.body.month,
    filledEarlier: true,
  });
  res.send("Accepted");
};
export const opiController = { 
    createNew : createNew
 };
