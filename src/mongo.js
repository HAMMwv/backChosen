const mongoose = require('mongoose')

require('dotenv').config();

const { Schema, model } = mongoose;
const connectionString = process.env.URL_DB_MONGO

mongoose.connect(connectionString)
    .then(()=>{
        console.log('databese connected');

    })
    .catch((err)=>{
        console.log(err);
    })

    