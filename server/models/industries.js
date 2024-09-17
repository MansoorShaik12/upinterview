const mongoose = require('mongoose');

const IndustrySchema = new mongoose.Schema({
    IndustryName: {
        type: String,
        required: true
    },
    CreatedDate: {
        type: Date,
        default: Date.now
    },
    CreatedBy: String,
    ModifiedDate: Date,
    ModifiedBy: String,
});
IndustrySchema.pre('save', function(next) {
    if (this.isNew) {
        this.CreatedDate = Date.now();
    }
    next();
});

const  Industry = mongoose.model("Industry", IndustrySchema);
module.exports =  Industry;
