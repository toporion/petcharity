const AdoptionModel = require('../models/AdoptionModel');
const UserModel = require('../models/UserModel');
const AnimalModel = require('../models/AnimalModel');

const getReportSummary = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        // Adoptions
        const monthlyAdoptions = await AdoptionModel.countDocuments({ requestDate: { $gte: startOfMonth } });
        const yearlyAdoptions = await AdoptionModel.countDocuments({ requestDate: { $gte: startOfYear } });
        const totalAdoptions = await AdoptionModel.countDocuments();

        const adoptionStatus = await AdoptionModel.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Users
        const monthlyUsers = await UserModel.countDocuments({ createdAt: { $gte: startOfMonth } });
        const yearlyUsers = await UserModel.countDocuments({ createdAt: { $gte: startOfYear } });
        const totalUsers = await UserModel.countDocuments();

        // Animals
        const monthlyAnimals = await AnimalModel.countDocuments({ arrivedDate: { $gte: startOfMonth } });
        const yearlyAnimals = await AnimalModel.countDocuments({ arrivedDate: { $gte: startOfYear } });
        const totalAnimals = await AnimalModel.countDocuments();

        res.status(200).json({
            adoptions: {
                month: monthlyAdoptions,
                year: yearlyAdoptions,
                total: totalAdoptions,
                statusBreakdown: adoptionStatus
            },
            users: {
                month: monthlyUsers,
                year: yearlyUsers,
                total: totalUsers
            },
            animals: {
                month: monthlyAnimals,
                year: yearlyAnimals,
                total: totalAnimals
            }
        });
    } catch (error) {
        console.error("Error generating admin report:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getReportSummary };
