const { Schema, model } = require('mongoose');

const ProductsModelSchema = new Schema({
    product : Object
})

ProductsModelSchema.set('toJSON',{
    transform:  (documento, returnedObject)=>{
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const ProductsModel = model('product', ProductsModelSchema);

module.exports = ProductsModel;