
// Combine all schemas into one
const mongoose = require('mongoose');

const ContactsSchema = new mongoose.Schema({
  // Fields from LoginBasicDetails1
  Name: String,
  Firstname: String,
  CountryCode: String,
  UserId: String,
  Email: String,
  Phone: String,
  LinkedinUrl: String,
  Gender: String,
  isFreelancer: String,
  ImageData: {
    filename: String,
    path: String,
    contentType: String,
  },
  TimeZone: String,
  PreferredDuration: String,

  // Fields from LoginAdditionalDetails
  CurrentRole: String,
  industry: String,
  Experience: String,
  location: String,
  Introduction: String,

  // Fields from LoginSkills
  Technology: [String],
  Skill: [String],
  experienceYears: String,
  previousExperience: String,
  expertiseLevel: String,

  availability: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LoginAvailability' }],
  
  // Reference to Users
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },

  CreatedDate: {
    type: Date,
    required: true,
    default: Date.now 
  },
  CreatedBy: {
    type: String,
    required: true
  },
  ModifiedDate: {
    type: Date,
    default: Date.now 
  },
  ModifiedBy: {
    type: String 
  }
});

const ContactHistorySchema = new mongoose.Schema({
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contacts', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  Name: String,
  Firstname: String,
  CountryCode: String,
  UserId: String,
  Email: String,
  Phone: String,
  LinkedinUrl: String,
  Gender: String,
  isFreelancer: String,
  ImageData: {
    filename: String,
    path: String,
    contentType: String,
  },
  CurrentRole: String,
  industry: String,
  Experience: String,
  location: String,
  Introduction: String,
  Technology: [String],
  Skill: [String],
  experienceYears: String,
  previousExperience: String,
  expertiseLevel: String,
  CreatedDate: Date,
  CreatedBy: String,
  ModifiedDate: Date,
  ModifiedBy: String,
  updatedAt: { type: Date, default: Date.now }
});

const Contacts = mongoose.model('Contacts', ContactsSchema);
const ContactHistory = mongoose.model('ContactHistory', ContactHistorySchema);

module.exports = {
  Contacts,
  ContactHistory
};