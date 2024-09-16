// models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    mobNo: Number,
    date: Date,
    buildingType: String,
    address: String,
    attachment: String,
    status: { type: String, default: "pending" },
    scheduleDate: Date,
    officerName: String,
    officerMobNo: String,
    officerEmail: String,
  },
  { collection: "formdatas" }
);

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
