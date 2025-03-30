const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adoptionSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    animal: { type: mongoose.Schema.Types.ObjectId, ref: 'animals', required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    requestDate: { type: Date, default: Date.now },
    approvalDate: { type: Date },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    housingType: { type: String, required: true },
    ownOrRent: { type: String, required: true },
    message: { type: String, required: true }
});

const AdoptionModel = mongoose.model('adoptions', adoptionSchema);
module.exports = AdoptionModel;
