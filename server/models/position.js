const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  title: String,
  companyname: String,
  jobdescription: String,
  minexperience: Number,
  maxexperience: Number,
  skills: [
    {
      skill: String,
      experience: String,
      expertise: String,
    },
  ],
  additionalnotes: String,
  createdAt: { type: Date, default: Date.now },
  rounds: [{
    round: String,
    customRoundName: String,
    mode: String,
    duration: String,
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' }]
  }],
  CreatedBy:String,

});

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;