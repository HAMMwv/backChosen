// const { Schema, model } = require('mongoose');

const { Schema, model } = require("mongoose");

const RegisterPayModelSchema = new Schema({    
        id: Number,
        status: String,
        status_detail: String,
        idParams: String,
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