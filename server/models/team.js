const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Phone: String,
    CompanyName: { type: String, required: true },
    CurrentRole: { type: String, required: true },
    Technology: { type: String, required: true },
    Location: { type: String, required: true },
    ImageData: {
        filename: String,
        path: String,
        contentType: String,
    },
    skills: [
        {
            skill: String,
            experience: String,
            expertise: String,
        },
    ],
    PreferredDuration: { type: String, required: true },
    TimeZone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    CreatedBy:String,
});

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;