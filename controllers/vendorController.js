const Vendor = require('../models/Vendor');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');
dotEnv.config();
const secretKey= process.env.whatIsYourname;
const vendorRegister = async (req, res) => { 
    
    const { username, email,  password } = req.body;

    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json( "Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new Vendor({
            username,
            email,
            phone: req.body.phone, // Assuming phone is optional and passed in the request body
            password: hashedPassword
        });
        await newVendor.save();

        res.status(201).json('Vendor registered successfully');

        console.log('registered:');
        
    } catch (error) {
        console.error("Error in vendorRegister:", error.message);
        res.status(500).json( "Server error, please try again later");
    }
}
const vendorLogin = async (req, res) => {

    const { email, password } = req.body;

 
    try{
        const vendor= await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({error: "Invalid email or password"});
        }

        // Generate JWT token
        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: '1h' });

        const vendorId= vendor._id;
        res.status(200).json({message: "Login successful",token,vendorId})
        
        console.log(email,"this is token", token);
        
    }catch (error) {
        console.error("Error in vendorLogin:", error.message);
        return res.status(500).json("Server error, please try again later");
    }
}

const getAllVendors = async (req, res) => {
    try{
        const vendors = await Vendor.find().populate('firms');
    
        res.json({vendors});

    }catch (error) {
        console.error("Error in getAllVendors:", error.message);
        res.status(500).json("Server error, please try again later");

}
}
const getVendorbyId=async (req, res) => {

    const { vendorId } = req.params;
    try {
        const vendor = await Vendor.findById(vendorId).populate('firms');
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        } 
        const vendorFirmId= vendor.firms[0]._id;
         res.status(200).json({ vendorId,vendorFirmId, vendor});
         console.log(vendorFirmId);
    } catch (error) {
        console.error("Error in getVendorbyId:", error.message);
        res.status(500).json("Server error, please try again later");
    }
}
module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorbyId };