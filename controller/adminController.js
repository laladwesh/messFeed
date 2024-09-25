// import { mailList } from "../shared/mailList";

// const Response = require("../models/response");
// const nodemailer = require("nodemailer"); 
// const mongoose = require("mongoose");


// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: '**', // replace with your email
//     pass: '**', // replace with your password
//   },
// });


// const allOpi = async (req, res) => {
//   try {

//     const today = new Date();


//     const startOfMonthIST = new Date(today.getFullYear(), today.getMonth(), 1);
//     startOfMonthIST.setUTCHours(0, 0, 0, 0); 
    
  
//     const endOfDayIST = new Date(today.setUTCHours(23, 59, 59, 999));


//     const opiRes = await Response.find({
//       timestamp: {
//         $gte: startOfMonthIST,
//         $lte: endOfDayIST,
//       },
//     });


//     res.status(200).json(opiRes);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching current month's data", error });
//   }
// };


// const archiveAndSendEmail = async () => {
//   try {

//     const today = new Date();

 
//     if (today.getDate() === 1) {

//       const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//       const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); 

//       const lastMonthData = await Response.find({
//         timestamp: {
//           $gte: lastMonth,
//           $lte: endOfLastMonth,
//         },
//       });

//       const emailContent = JSON.stringify(lastMonthData);


//       const mailOptions = {
//         from: '**',
//         to: mailList, 
//         subject: `Data for ${lastMonth.toLocaleString('default', { month: 'long' })} ${lastMonth.getFullYear()}`,
//         text: `Here is the data for the month of ${lastMonth.toLocaleString('default', { month: 'long' })}:\n\n${emailContent}`,
//       };


//       await transporter.sendMail(mailOptions);
//       console.log("Last month's data sent to emails");

     
//       await Response.deleteMany({
//         timestamp: {
//           $gte: lastMonth,
//           $lte: endOfLastMonth,
//         },
//       });
//       console.log("Last month's data deleted from database");
//     }
//   } catch (error) {
//     console.error("Error sending last month's data:", error);
//   }
// };


// const scheduleDailyCheck = () => {
//   const cron = require("node-cron");


//   cron.schedule("0 0 * * *", async () => {
//     console.log("Running daily check for month-end data archival...");
//     await archiveAndSendEmail();
//   });
// };

// // Start the scheduler
// scheduleDailyCheck();

// export const adminController = {
//   allOpi,
// };
import cron from "node-cron";
import {Response} from "../models/response.js";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";

// Configure your nodemailer to send emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // replace with your email
    pass: 'your-password', // replace with your password
  },
});

// Function to convert data to an Excel file
const convertToExcel = (data, fileName) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Convert JSON data to worksheet
  const ws = XLSX.utils.json_to_sheet(data);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Save Excel file to disk
  const filePath = path.join(__dirname, fileName);
  XLSX.writeFile(wb, filePath);

  return filePath; // Return the file path
};

// Function to handle month-end data archival and sending emails
const archiveAndSendEmail = async () => {
  try {
    // Get current date
    const today = new Date();

    // If today is the 1st of the month, send last month's data
    if (today.getDate() === 1) {
      // Calculate the last month's start and end date
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // End of last month

      // Fetch last month's data
      const lastMonthData = await Response.find({
        timestamp: {
          $gte: lastMonth,
          $lte: endOfLastMonth,
        },
      });

      if (lastMonthData.length > 0) {
        // Convert last month's data to Excel
        const fileName = `last_month_data_${lastMonth.getFullYear()}_${lastMonth.getMonth() + 1}.xlsx`;
        const filePath = convertToExcel(lastMonthData, fileName);

        // Define recipients and email options
        const mailOptions = {
          from: 'your-email@gmail.com',
          to: ['email1@example.com', 'email2@example.com', 'email3@example.com', 'email4@example.com', 'email5@example.com'], // 5 email addresses
          subject: `Data for ${lastMonth.toLocaleString('default', { month: 'long' })} ${lastMonth.getFullYear()}`,
          text: `Please find attached the data for the month of ${lastMonth.toLocaleString('default', { month: 'long' })}.`,
          attachments: [
            {
              filename: fileName,
              path: filePath, // Attach the Excel file
            },
          ],
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log("Last month's data sent to emails");

        // Optionally, delete the file after sending
        fs.unlinkSync(filePath); // Remove the file from the server
        console.log("Excel file deleted from the server");

        // Optionally, delete last month's data from the database
        await Response.deleteMany({
          timestamp: {
            $gte: lastMonth,
            $lte: endOfLastMonth,
          },
        });
        console.log("Last month's data deleted from database");
      } else {
        console.log("No data found for last month.");
      }
    }
  } catch (error) {
    console.error("Error sending last month's data:", error);
  }
};

// Schedule a daily check to run the archive and send email function at midnight (server time)
const scheduleDailyCheck = () => {


  // Run the check every day at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily check for month-end data archival...");
    await archiveAndSendEmail();
  });
};

// Start the scheduler
scheduleDailyCheck();

export const adminController = {
  archiveAndSendEmail,
  scheduleDailyCheck,
  
};
