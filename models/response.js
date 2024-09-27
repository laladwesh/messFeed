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
    hostel: {
      type: String,
      enum: allIITGHostels,
    },
    phoneNumber: {
      type: Number,
      min: [1000000000, "Invalid mobile number."],
      max: [9999999999, "Invalid mobile number."],
    },
    opiLunch: {
      type : Number,
      min: [1, "Rate in Scale of 10."],
      max: [10, "Rate in Scale of 10."],
    },
    opiBreakfast: {
      type : Number,
      min: [1, "Rate in Scale of 10."],
      max: [10, "Rate in Scale of 10."],
    },
    opiDinner: {
      type : Number,
      min: [1, "Rate in Scale of 10."],
      max: [10, "Rate in Scale of 10."],
    },
    opiComments: {
      type: String,
      required: true,
    },
    subscribedMess: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export const Response = model("response", responseSchema);
