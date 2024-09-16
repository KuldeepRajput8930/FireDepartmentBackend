const mongoose = require("mongoose");

const OfficerLoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const OfficerLogin = mongoose.model("OfficerLogin", OfficerLoginSchema);

module.exports = OfficerLogin;
