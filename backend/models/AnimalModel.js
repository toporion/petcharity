const mongoose = require('mongoose')
const Schema = mongoose.Schema

const animalSchema = new Schema({
    name:{type:String},
    breed: {
        type: String,
        enum: ['Labrador', 'Bulldog', 'Poodle', 'Beagle'], // Predefined list or dynamic
        required: true
    },
    species: {
        type: String,
        enum: ['Dog', 'Cat', 'Rabbit'], // Predefined list or dynamic
        required: true
    },
    color: { type: String, required: true },
    age: { type: String, required: true },
    sex: { type: String, enum: ["Male", "Female"], required: true },
    arrivedDate: { type: Date },
    arrivedFrom: { type: String },
    size: {
        type: String,
        enum: ["Small (<15kg)", "Large (15-30kg)", "Extra Large (>30kg)"],
       
    },
    location: {
        type: String,
        enum: ['New York', 'Los Angeles', 'Chicago'], // Predefined list or dynamic
       
    },
    rehomingFee: { type: Number, required: true },
    adoptionStatus: { type: String, enum: ['In Rescue', 'Adopted'], default: 'In Rescue' },
    profileImage: String,
})

const AnimalModel=mongoose.model('animals',animalSchema)
module.exports=AnimalModel;