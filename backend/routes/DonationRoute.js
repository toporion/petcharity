const { createDonation, getAllDonations,  generateDonationCertificate, getDonationReport, updatePaymentStatus } = require('../controllers/DonationController')

const route = require('express').Router()


route.post('/donation', createDonation)
// ✅ Route to get all donations
route.get("/donation", getAllDonations);


route.get("/certificate/:id", generateDonationCertificate);
route.get('/donation-report', getDonationReport);
// Update donation payment status
route.put('/update-payment-status/:donationId', updatePaymentStatus);

module.exports = route;