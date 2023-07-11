const { Schema, model } = require('mongoose');

const UserModelSchema = new Schema({
    email: String,
    password: String 
});

UserModelSchema.set('toJSON',{
    transform: (documento, returnedObject)=>{
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const UserModel = model('UserModel', UserModelSchema);

module.exports = UserModel;