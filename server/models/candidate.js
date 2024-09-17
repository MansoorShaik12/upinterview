const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: String,
    Phone: String,
    Date_Of_Birth: Date,
    Gender: String,
    HigherQualification: String,
    UniversityCollege: String,
    CurrentExperience: Number,
    PositionId: String,
    skills: [
        {
            skill: String,
            experience: String,
            expertise: String,
        },
    ],
    createdAt: { type: Date, default: Date.now },
    Position: String,
    ImageData: {
        filename: String,
        path: String,
        contentType: String,
    },
    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    createdBy:String,

});

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;