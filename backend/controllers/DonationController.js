const DonationModel = require("../models/DonationModel");
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');





// ✅ Add a New Donation
const createDonation = async (req, res) => {
    try {
        console.log("Received request body:", req.body); // Debugging
        const { donorName, donorEmail, amount,paymentMethod } = req.body;

        if (!donorName || !donorEmail || !amount) {
            return res.status(400).json({ success: false, message: "Name, email, and amount are required." });
        }

        const newDonation = new DonationModel({
            donorName,
            donorEmail,
            amount,
            paymentMethod,
            donationDate: new Date(),
            status: "Pending"
        });
        await newDonation.save();

        res.status(201).json({ success: true, message: "Donation recorded successfully!", data: newDonation });
    } catch (error) {
        console.error("Error creating donation:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


// ✅ Get All Donations
const getAllDonations = async (req, res) => {
    try {
        const donations = await DonationModel.find().sort({ donationDate: -1 });
        res.status(200).json({ success: true, data: donations });
    } catch (error) {
        console.error("Error fetching donations:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



const generateDonationCertificate = async (req, res) => {
    try {
        const { donorName, donorEmail, amount } = req.body;

        // Create a new PDF document
        const doc = new PDFDocument();

        // Use the path module to create the file path for saving the PDF
        const filePath = path.join(__dirname, 'certificates', `${donorName}-donation.pdf`);

        // Pipe the document to the file system
        doc.pipe(fs.createWriteStream(filePath));

        // Add content to the PDF
        doc.fontSize(25).text('Donation Certificate', { align: 'center' });
        doc.moveDown(1); // Adds some spacing
        doc.fontSize(16).text(`Donor Name: ${donorName}`, { align: 'left' });
        doc.text(`Email: ${donorEmail}`, { align: 'left' });
        doc.text(`Donation Amount: $${amount}`, { align: 'left' });
        doc.moveDown(1); // Adds some spacing
        doc.text('Thank you for your generous contribution!', { align: 'center' });

        // Optionally, add a date or any other additional information
        doc.moveDown(1);
        doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });

        // Finalize the PDF and end the stream
        doc.end();

        // Send a response once the file is created
        res.status(200).send({ success: true, filePath });
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send({ success: false, message: "Error generating PDF" });
    }
};


// Get total donations for a specific month/year
const getDonationReport = async (req, res) => {
    try {
        const year = parseInt(req.query.year);
        const month = req.query.month ? parseInt(req.query.month) : null;

        // Validate year and month
        if (isNaN(year) || (month && (month < 1 || month > 12))) {
            return res.status(400).json({ success: false, message: "Invalid year or month" });
        }

        // Create date range
        let startDate, endDate;
        if (month) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0, 23, 59, 59);
        } else {
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31, 23, 59, 59);
        }

        console.log("Start Date:", startDate, "End Date:", endDate);

        // Get total donations within the range
        const totalAmount = await DonationModel.aggregate([
            { 
                $match: { 
                    donationDate: { $gte: startDate, $lte: endDate }, 
                    paymentStatus: "Completed" 
                } 
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.status(200).json({ 
            success: true, 
            totalDonations: totalAmount.length ? totalAmount[0].total : 0,
            year,
            month: month || "Full Year"
        });

    } catch (error) {
        console.error("Error fetching donation report:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const updatePaymentStatus = async (req, res) => {
    try {
        const { donationId } = req.params;
        const { paymentStatus } = req.body;

        // Validate input
        if (!["Pending", "Completed", "Failed"].includes(paymentStatus)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        // Update payment status
        const updatedDonation = await DonationModel.findOneAndUpdate(
            { donationId },
            { paymentStatus },
            { new: true }
        );

        if (!updatedDonation) {
            return res.status(404).json({ success: false, message: "Donation not found" });
        }

        res.status(200).json({ success: true, message: "Payment status updated", updatedDonation });

    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};






module.exports = { createDonation, getAllDonations, generateDonationCertificate,getDonationReport,
    updatePaymentStatus
 };
