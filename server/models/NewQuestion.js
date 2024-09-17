// const mongoose = require('mongoose');

// const newQuestionSchema = new mongoose.Schema({
//     Question: String,
//     QuestionType: String,
//     SectionName: String,
//     DifficultyLevel: String,
//     Score: String,
//     Answer: String,
//     CreatedDate: {
//         type: Date,
//         default: Date.now
//     },
//     CreatedBy: String,
//     ModifiedDate: Date,
//     ModifiedBy: String,
// });

// newQuestionSchema.pre('save', function (next) {
//     const now = Date.now();
//     if (this.isNew) {
//         this.CreatedDate = now;
//     }
//     this.ModifiedDate = now;
//     next();
// });

// const questionOptionSchema = new mongoose.Schema({
//     QuestionId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'NewQuestion',
//     },
//     Options: [String],
//     CreatedDate: {
//         type: Date,
//         default: Date.now
//     },
//     CreatedBy: String,
//     ModifiedDate: Date,
//     ModifiedBy: String,
// });

// questionOptionSchema.pre('save', async function (next) {
//     const now = Date.now();
//     if (this.isNew) {
//         this.CreatedDate = now;
//     }
//     this.ModifiedDate = now;

//     if (!this.isNew) {
//         // Save the history record before updating the option
//         const history = new QuestionOptionHistory({
//             QuestionOptionId: this._id,
//             QuestionId: this.QuestionId,
//             Options: this.Options,
//             Action: 'Updated',
//             ActionDate: now,
//             CreatedDate: this.CreatedDate,
//             CreatedBy: this.CreatedBy,
//             ModifiedDate: now,
//             ModifiedBy: this.ModifiedBy,
//         });
//         await history.save();
//     }

//     next();
// });

// const questionOptionHistorySchema = new mongoose.Schema({
//     QuestionOptionId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'QuestionOption',
//         required: true,
//     },
//     QuestionId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'NewQuestion',
//         required: true,
//     },
//     Options: [String],
//     Action: String, // e.g., "Created", "Updated", "Deleted"
//     ActionDate: {
//         type: Date,
//         default: Date.now,
//     },
//     CreatedDate: Date,
//     CreatedBy: String,
//     ModifiedDate: Date,
//     ModifiedBy: String,
// });

// const newQuestionHistorySchema = new mongoose.Schema({
//     NewQuestionId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'NewQuestion',
//         required: true,
//     },
//     Question: String,
//     QuestionType: String,
//     SectionName: String,
//     DifficultyLevel: String,
//     Score: String,
//     Answer: String,
//     Action: String,
//     ActionDate: {
//         type: Date,
//         default: Date.now,
//     },
//     CreatedDate: Date,
//     CreatedBy: String,
//     ModifiedDate: Date,
//     ModifiedBy: String,
// });


// const NewQuestionHistory = mongoose.model("NewQuestionHistory", newQuestionHistorySchema);
// const NewQuestion = mongoose.model("NewQuestion", newQuestionSchema);
// const QuestionOption = mongoose.model("QuestionOption", questionOptionSchema);
// const QuestionOptionHistory = mongoose.model("QuestionOptionHistory", questionOptionHistorySchema);

// module.exports = {
//     NewQuestion,
//     QuestionOption,
//     QuestionOptionHistory,
//     NewQuestionHistory
// };


const mongoose = require('mongoose');

const newQuestionSchema = new mongoose.Schema({
    Question: String,
    QuestionType: String,
    Skill: String,
    DifficultyLevel: String,
    Score: String,
    Answer: String,
    Options: [String], // Add Options array here
    CreatedDate: {
        type: Date,
        default: Date.now
    },
    createdBy: String,
    ModifiedDate: Date,
    ModifiedBy: String,
});

newQuestionSchema.pre('save', function (next) {
    if (this.isNew) {
        this.CreatedDate = Date.now();
    }
    next();
});

const NewQuestion = mongoose.model("NewQuestion", newQuestionSchema);
module.exports = {
    NewQuestion
};