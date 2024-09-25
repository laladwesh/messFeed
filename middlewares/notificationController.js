const firebase = require("firebase-admin");
const userModel = require("../models/userModel");
const userNotifTokenModel = require("../models/userNotifTokenModel");
const { sendToAllFirebaseTopicName } = require("../helpers/constants");
const { body, matchedData } = require("express-validator");

// Notification controller for mess performance index
exports.sendMessPerformanceNotif = async (req, res) => {
  try {
    // Step 1: Prepare notification payload
    const payload = {
      notification: {
        title: "Hostel Mess Performance Index",
        body: "Please fill out the mess performance feedback for this month.",
      },
      data: {
        category: "mess_feedback",
        title: "Mess Feedback",
        body: "Please provide your feedback on the hostel mess performance.",
      },
    };

    // Step 2: Fetch all campus user notification tokens
    let allCampusUsers = await userModel.find(); // Adjust this query to target only users in hostels if needed
    let allNotifTokens = [];

    // Collect notification tokens for all users
    for (let user of allCampusUsers) {
      let userNotifTokens = await userNotifTokenModel.find({ userid: user._id });
      allNotifTokens.push(...userNotifTokens.map(token => token.deviceToken));
    }

    // Step 3: Send notifications to all campus users
    const options = { priority: "high" };
    for (let deviceToken of allNotifTokens) {
      await firebase.messaging().sendToDevice(deviceToken, payload, options);
      console.log(`Notification sent to device: ${deviceToken}`);
    }

    res.json({ success: true, message: "Mess performance index notification sent to all users." });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ success: false, message: "Error sending notification", error });
  }
};

// Middleware to validate request if needed
exports.validateMessPerformanceRequest = [
  body("category", "Category is required").exists(),
  body("title", "Title is required").exists(),
  body("body", "Body content is required").exists(),
];
