const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleMasterSchema = new Schema({
    RoleName: {
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
}, { collection: 'RoleMaster' });

// Pre-save hook to update ModifiedDate before saving
RoleMasterSchema.pre('save', function (next) {
    // Only set CreatedDate if it is a new document
    if (this.isNew) {
        this.CreatedDate = Date.now();
    }
    // Always update the ModifiedDate
    this.ModifiedDate = Date.now();
    next();
});

module.exports = mongoose.model('RoleMaster', RoleMasterSchema);