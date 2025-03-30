const UserModel = require("../models/UserModel");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email })
        if (user) {
            return res.status(403).json({ success: false, message: "User allready exist" })
        }
        const profileImage = req.file ? req.file.path : null
        const hashPasdsword = await bcrypt.hash(password, 10)
        const newUser = new UserModel({
            ...req.body,
            profileImage,
            password: hashPasdsword
        })
        await newUser.save()
        res.status(200).json({
            success: true,
            message: "User Successfully created",
            data: newUser
        })
    } catch (error) {
        console.log('see the main error', error)
        res.status(500).json({ success: true, message: "Internal server error" })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(403).json({ success: false, message: "User not found" });
        }

        if (!password) {
            return res.status(403).json({ success: false, message: "Password required" });
        }

        const isMatch = await bcrypt.compare(String(password), user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Password not matched" });
        }

        // ✅ Include `role` inside the JWT token
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role }, // Added role
            process.env.SECRET_TOKEN,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            jwtToken,
            user: { name: user.name, email: user.email, image: user.profileImage, role: user.role }
        });

    } catch (error) {
        console.log('see the login error', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const getAllUser = async (req, res) => {
    try {

        const allUsers = await UserModel.find({})
        res.status(200).json({
            success: true,
            message: "Successfully get all users",
            data: allUsers
        })
    } catch (error) {
        console.log('see if error when getting', error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const getSingleUser = await UserModel.findById({ _id: id })
        res.status(200).json({
            success: true,
            message: "successfully get user by id",
            data: getSingleUser
        })

    } catch (error) {
        console.log('see where error', error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const deleteUser=async(req,res)=>{
    try{
        const {id}=req.body;
        const userDelete=await UserModel.deleteOne(id)
        res.status(200).json({sucess:true,message:"successfully deleted",data:userDelete})
    }catch(error){
        res.status(500).json({sucess:false,message:"Internal server error"})
    }
}

const makeRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || (role !== "admin" && role !== "user")) {
            return res.status(400).json({
                success: false,
                message: "Invalid role provided. Allowed values are 'admin' or 'user'."
            });
        }
        const updateUserRole = await UserModel.findByIdAndUpdate(
            id,
            { role: role },
            { new: true }
        )
        if (!updateUserRole) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        return res.status(200).json({
            success: true,
            message: "User role updated successfully.",
            data: updateUserRole
        });
    } catch (error) {

    }
}
module.exports = { createUser, loginUser, getAllUser, getUserById,makeRole,deleteUser}