import cron from "node-cron";
import { Response } from "../models/response.js";
import nodemailer from "nodemailer";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // replace with your email
    pass: 'your-password', // replace with your password
  },
});

const convertToExcel = (data, fileName) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const filePath = path.join(__dirname, fileName);
  XLSX.writeFile(wb, filePath);
  return filePath;
};

const sendEmailForDate = async (date, recipients) => {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);
  const data = await Response.find({
    timestamp: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  if (data.length > 0) {
    const fileName = `OPIdata_${date}.xlsx`;
    const filePath = convertToExcel(data, fileName);

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: recipients,
      subject: `Data for ${date}`,
      text: `Please find attached the data for ${date}.`,
      attachments: [
        {
          filename: fileName,
          path: filePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Data for ${date} sent to emails`);
    fs.unlinkSync(filePath);
  } else {
    console.log(`No data found for ${date}`);
  }
};

const sendSummaryEmail = async (startDate, endDate, recipients) => {
  const start = new Date(startDate);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setUTCHours(23, 59, 59, 999);

  const data = await Response.find({
    timestamp: {
      $gte: start,
      $lte: end,
    },
  });

  if (data.length > 0) {
    const fileName = `OPIdata_${startDate}_to_${endDate}.xlsx`;
    const filePath = convertToExcel(data, fileName);

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: recipients,
      subject: `Summary Data from ${startDate} to ${endDate}`,
      text: `Please find attached the summary data for the range from ${startDate} to ${endDate}.`,
      attachments: [
        {
          filename: fileName,
          path: filePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Summary data from ${startDate} to ${endDate} sent to emails`);
    fs.unlinkSync(filePath);

    await Response.deleteMany({
      timestamp: {
        $gte: start,
        $lte: end,
      },
    });
    console.log(`Data from ${startDate} to ${endDate} deleted from database`);
  } else {
    console.log(`No summary data found from ${startDate} to ${endDate}`);
  }
};

const processDateList = async (dateList, recipients) => {
  if (!Array.isArray(dateList) || dateList.length === 0) return;

  const startDate = dateList[0];
  const endDate = dateList[dateList.length - 1];

  for (const date of dateList) {
    await sendEmailForDate(date, recipients);
  }

  await sendSummaryEmail(startDate, endDate, recipients);
};

const scheduleDateProcessing = () => {
  const dateList = ["2024-09-25", "2024-09-26", "2024-09-27"];
  const recipients = ['email1@example.com', 'email2@example.com'];

  cron.schedule("0 0 * * *", async () => {
    console.log("Running scheduled date processing...");
    await processDateList(dateList, recipients);
  });
};

scheduleDateProcessing();

export const adminController = {
  processDateList,
  scheduleDateProcessing,
};