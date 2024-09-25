const Response = require("../models/response");

const createNew = async (req, res) => {
  const userCheck = Response.findById({ outlookEmail: req.body.outlookEmail });
  const {name , outlookEmail , rollNo , gender , hostel , phoneNumber} = req.body;
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
};
export const opiController = { 
    createNew : createNew
 };
