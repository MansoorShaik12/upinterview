const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  Question: String,
  QuestionType: String,
  DifficultyLevel: String,
  Score: Number,
  Options: [String],
  Answer: String,
  ProgrammingDetails: [{
    language: String,
    code: String,
    testCases: [{
      name: String,
      input: String,
      output: String,
      marks: Number
    }]
  }],
  CreatedBy: String,
  CreatedDate: {
    type: Date,
    default: Date.now
  },
  ModifiedDate: Date,
  ModifiedBy: String,
});

const sectionSchema = new mongoose.Schema({
  Category: String,
  SectionName: String,
  Position: String,
  Questions: [questionSchema],
  CreatedDate: {
    type: Date,
    default: Date.now
  },
  CreatedBy: String,
  ModifiedDate: Date,
  ModifiedBy: String,
});

const assessmentSchema = new mongoose.Schema({
  AssessmentTitle: String,
  AssessmentType: [String],
  Position: String,
  Duration: String,
  TotalScore: Number,
  DifficultyLevel: String,
  NumberOfQuestions: Number,
  ExpiryDate: Date,
  Sections: [sectionSchema],
  CreatedBy: String,
  ModifiedDate: Date,
  ModifiedBy: String,
  CandidateIds: [mongoose.Schema.Types.ObjectId],
});

const Assessment = mongoose.model("Assessment", assessmentSchema);
module.exports = Assessment;