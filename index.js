import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { opiController }from "./controller/opiController.js";
import { verifyUserInfo } from "./middlewares/userInfo.js";
import { scheduleDateProcessing, processDateList } from "./controller/adminController.js";
import {NotFoundError} from './errors/notFoundError.js'
// mongoose.set("strictQuery", false);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3601;

// app.use("*",(req,res) => {
//   throw new NotFoundError("Route not found");
// });
app.get('/' , (req , res) => {
  res.json("Connected to server");
})
app.post('/new' , verifyUserInfo , opiController.createNew );
// app.get('/admin/all' , verifyUserInfo , adminController.archiveAndSendEmail);

try {
  scheduleDateProcessing();
}
catch (e) {
  console.log("Error in scheduling emails", e);
}

server.listen(PORT, async () => {
  console.log(`Listening at ${PORT}`);
  await mongoose.connect(process.env.MONGO_URL)
  console.log("Database Connected");
});
