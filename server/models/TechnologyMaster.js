// (z
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TechnologyMasterSchema = new Schema({
    TechnologyMasterName: {
        type: String,
        required: true
    },
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
}, { collection: 'TechnologyMaster' });

// Pre-save hook to update ModifiedDate before saving
TechnologyMasterSchema.pre('save', function(next) {
    // Only set CreatedDate if it is a new document
    if (this.isNew) {
        this.CreatedDate = Date.now();
    }
    // Always update the ModifiedDate
    this.ModifiedDate = Date.now();
    next();
});

module.exports = mongoose.model('TechnologyMaster', TechnologyMasterSchema);
// z)