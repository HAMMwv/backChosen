// const { Schema, model } = require('mongoose');

const { Schema, model } = require("mongoose");

const PayModelSchema = new Schema({
    status:String,
    payData: {
        document: { 
           
        },
        card: {
        number: String,
        exp_month: String,
        exp_year: String,
        cvc: String,
        holder_name: String,
        installments: Number
        },
        address: {
             street: String,
             city: String,
        },
        child_quantity: Number,
        items_id: [ Number, Number ]
    },
    idParams: String,
    date: Date,
});

PayModelSchema.set('toJSON',{
    transform: (documento, returnedObject)=>{
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const PayModel = model('PayModel',PayModelSchema);

module.exports = PayModel;