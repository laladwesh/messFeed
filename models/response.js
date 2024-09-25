import { Schema, model } from "mongoose";
import {allIITGHostels} from '../shared/constant.js'
const responseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    outlookEmail: {
      type: String,
      required: true,
    },
    rollNo: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    hostel: {
      type: String,
      enum: allIITGHostels,
    },
    phoneNumber: {
      type: Number,
      min: [1000000000, "Invalid mobile number."],
      max: [9999999999, "Invalid mobile number."],
    },
    opiRating: {
      type : Number,
      min: [1, "Rate in Scale of 10."],
      min: [10, "Rate in Scale of 10."],
    },
    opiComments: {
      type: String,
      required: true,
    },
    subscribedMess: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    filledEarlier : {
      type : Boolean,
      required : true,
      default : false
    },
  },
  { timestamps: true }
);

export const Response = model("response", responseSchema);
