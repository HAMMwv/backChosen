const { Schema, model } = require('mongoose');

const ChosenModelSchema = new Schema({
    address_city : String,
    address_street: String,
    birthdate: String,
    email: String,
    foreign_person: String,
    gender: String,
    first_name: String,
    last_name: String,
    ocupation: String,
    donor_photo_base64 : String,
    payId: String, 
    referral_code: String, 
    identificationNumber: String, 
    identificationType: String, 
    date: String, 
    phone: {
        country:String,
        value:String,
    },
    photo: {
        url:String,
        file: Map,    
    },
    
});

ChosenModelSchema.set('toJSON',{
    transform: (documento, returnedObject)=>{
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const ChosenModel = model('ChosenModel', ChosenModelSchema);

module.exports = ChosenModel;