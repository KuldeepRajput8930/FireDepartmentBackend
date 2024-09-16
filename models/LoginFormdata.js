const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const LoginFormDataModel = mongoose.model('USER_REGISTRATION', FormDataSchema);

module.exports =LoginFormDataModel;
