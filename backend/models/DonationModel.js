const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // To generate unique donation IDs

const donationSchema = new mongoose.Schema({
    donationId: { type: String, default: uuidv4 }, // Unique ID for tracking
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    donorPhone: { type: String }, // Optional
    donorAddress: { type: String }, // Optional
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    donationDate: { type: Date, default: Date.now },
});

const DonationModel = mongoose.model('donations', donationSchema);
module.exports = DonationModel;
