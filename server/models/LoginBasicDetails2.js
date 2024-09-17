const mongoose = require('mongoose');

const LoginBasicDetails2Schema = new mongoose.Schema({
  Technology: [String],
  Skill: [String],
  previousExperience:String,
  expertiseLevel:String,
});

module.exports = mongoose.model('LoginBasicDetails2', LoginBasicDetails2Schema);