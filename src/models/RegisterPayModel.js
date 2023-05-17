// const { Schema, model } = require('mongoose');

const { Schema, model } = require("mongoose");

const RegisterPayModelSchema = new Schema({    
    aIdDonor : String,
    card: {
        emitter: String,
        expiration_month: Number,
        expiration_year: Number,
        first_eigth_digits: String,
        last_four_digits: String,
     },
     identification: String,
     typeIdentification: String,
     transaction: {
        id: Number,
        status: String,
        status_detail: String,
     },
     transaction_amount: String,
     date : Date,
});

RegisterPayModelSchema.set('toJSON',{
    transform: (documento, returnedObject)=>{
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const RegisterPayModel = model('RegisterPayModel',RegisterPayModelSchema);

module.exports = RegisterPayModel;