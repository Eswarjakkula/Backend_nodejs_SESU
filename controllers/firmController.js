const Firm= require('../models/Firm');
const Vendor= require('../models/Vendor');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb)  {
      cb(null, "uploads/"); // Folder where images will be stored
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() +path.extname(file.originalname)); // unique file name
    },
  });
const upload = multer({ storage: storage });

const addFirm = async(req, res) => {
  try{
    const { firmName, area, category, region, offer} = req.body;

    const image= req.file ? req.file.filename : undefined; 

    const vendor=await Vendor.findById(req.vendorId);

    
    if (!vendor) {
      res.status(404).json({ message: "Vendor not found" });
    }
    if(vendor.firms.length >0){
      return res.status(400).json({ message: "Vendor already has a firm" });
    }
    const firm= new Firm({
        firmName,
        area,
        category,
        region,
        offer,
        image,
        vendor: vendor._id // Assuming vendor._id is available in the request
    });
   
    const savedFirm= await firm.save(); 

    const firmId = savedFirm._id;


    vendor.firms.push(savedFirm);
    await vendor.save();
   

    return res.status(201).json({ message: "Firm added successfully", firmId });
  }catch (error) {
    console.error("Error in addFirm:", error.message);
    return res.status(500).json({ message: "Server error, please try again later" });
  }

}
const deleteFirmById= async (req, res) => {
  try {
      const firmId = req.params.productId;
      const deletedProduct = await Firm.findByIdAndDelete(firmId);
      if (!deletedProduct) {
          return res.status(404).json({ message: "Product not found" });
      }
    
  } catch (error) {
      console.error("Error in deleteProductById:", error.message);
      return res.status(500).json({ message: "Server error, please try again later" });
  }
};

module.exports = {addFirm: [upload.single('image'),addFirm],deleteFirmById}