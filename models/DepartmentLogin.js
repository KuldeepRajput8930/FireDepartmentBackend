const mongoose = require("mongoose");

const DepartmentLoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const DepartmentLogin = mongoose.model(
  "DepartmentLogin",
  DepartmentLoginSchema
);

module.exports = DepartmentLogin;
