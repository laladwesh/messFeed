import { Response } from "../models/response.js";

const createNew = async (req, res) => {
  try {
    const { name, outlookEmail, rollNo, subscribedMess, hostel } = req.user;
    //const [name, outlookEmail, rollNo, subscribedMess, hostel] = ["Avinash", "g.avinash", "230102013", "kameng", "kameng"];

    const userCheck = await Response.findOne({ outlookEmail });

    if (userCheck) {
      return res.status(400).json({ success: false, message: 'User already submitted a response' });
    }

    await Response.create({
      name,
      outlookEmail,
      rollNo,
      hostel,
      phoneNumber: req.body.contactNumber,
      opiLunch: req.body.opiRating,
      opiBreakfast: req.body.opiBreakfast,
      opiDinner: req.body.opiDinner,
      opiComments: req.body.opiComments,
      subscribedMess,
    });

    res.status(201).json({ success: true, message: "Response accepted" });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

export const opiController = {
  createNew,
};