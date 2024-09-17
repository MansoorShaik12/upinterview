const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    startTime: { type: String, required: true }, // Expecting strings in HH:MM format
    endTime: { type: String, required: true }
}, { _id: false });

const AvailabilitySchema = new mongoose.Schema({
    day: { type: String, required: true },
    timeSlots: [timeSlotSchema],
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contacts', required: true }
});

const LoginAvailability = mongoose.model('LoginAvailability', AvailabilitySchema);
module.exports = LoginAvailability;