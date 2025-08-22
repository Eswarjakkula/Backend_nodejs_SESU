const mongoose= require('mongoose');

const vendorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    firms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm'
    }]

    
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;