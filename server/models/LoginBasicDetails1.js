const mongoose = require('mongoose');

const LoginBasicDetails1Schema = new mongoose.Schema({
  Name: String,
  profileId: String,
  Email: String,
  Phone: String,
  LinkedinUrl: String,
});

module.exports = mongoose.model('LoginBasicDetails1', LoginBasicDetails1Schema);