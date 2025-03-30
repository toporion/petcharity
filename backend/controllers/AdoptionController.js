const AdoptionModel = require("../models/AdoptionModel");
const AnimalModel = require("../models/AnimalModel");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const adoptionRequest = async (req, res) => {
    try {
        const { userId, animalId,...formData } = req.body;

        const animal = await AnimalModel.findById(animalId)
        if (!animal) {
            return res.status(404).json({ success: false, message: "Animal not found" });
        }
        if (animal.adoptionStatus === 'Adopted') {
            return res.status(400).json({ success: false, message: "Animal is already adopted" });
        }
        const existingReqest = await AdoptionModel.findOne({ user: userId, animal: animalId })
        if (existingReqest) {
            return res.status(400).json({ success: false, message: "You have already requested to adopt this animal." });
        }
        const newAdoptionrequest = new AdoptionModel({
           
            user: userId,
            animal: animalId,
            ...formData,
        })
        await newAdoptionrequest.save()
        res.status(200).json({ success: true, message: "Adoption request submitted", data: newAdoptionrequest });
    } catch (error) {
        console.log('see the reqest error', error)
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getAdoptionRequest = async (req, res) => {
    try {
        const adoptions = await AdoptionModel.find().populate('user').populate('animal')
        res.status(200).json(adoptions);
    } catch (error) {
        console.log("Error in fetching adoptions:", error);
        res.status(500).json({ message: 'Server Error', error });
    }
}

const adoptionCotroll = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["Accepted", "Rejected"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const adoption = await AdoptionModel.findByIdAndUpdate(
            req.params.id,
            { status, approvalDate: status === "Accepted" ? new Date() : null },
            { new: true }
        ).populate("user animal");

        if (!adoption) {
            return res.status(404).json({ error: "Adoption request not found" });
        }

        if (status === "Accepted") {
            await AnimalModel.findByIdAndUpdate(adoption.animal._id, { adoptionStatus: "Adopted" });

            // Generate Receipt
            const pdfPath = await generateReceiptPDF(adoption);

            return res.status(200).json({ message: "Adoption approved", pdfPath, adoption });
        }

        res.status(200).json({ message: `Adoption ${status.toLowerCase()} successfully`, adoption });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const getAvailableAnimals = async (req, res) => {
    try {
        const availableAnimals = await AnimalModel.find({ adoptionStatus: 'In Rescue' });
        res.status(200).json(availableAnimals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const generateReceipt  = async (adoption) => {
    return new Promise((resolve, reject) => {
        const { user, animal, approvalDate } = adoption;
        const doc = new PDFDocument();
        const filePath = path.join(__dirname, `../receipts/Adoption_Receipt_${adoption._id}.pdf`);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        doc.fontSize(20).text("Adoption Receipt", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Adopter: ${user.name}`);
        doc.text(`Email: ${user.email}`);
        doc.text(`Phone: ${user.phone}`);
        doc.text(`Address: ${user.address}`);
        doc.moveDown();
        doc.text(`Animal: ${animal.name} (${animal.species}, ${animal.breed})`);
        doc.text(`Rehoming Fee: $${animal.rehomingFee}`);
        doc.text(`Adoption Date: ${approvalDate.toDateString()}`);
        doc.moveDown();
        doc.text("Thank you for adopting!", { align: "center" });

        doc.end();
        stream.on("finish", () => resolve(filePath));
        stream.on("error", reject);
    });
};



module.exports = { adoptionRequest, getAdoptionRequest, adoptionCotroll,getAvailableAnimals,generateReceipt }