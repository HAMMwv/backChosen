const mongoose = require('mongoose')
const { Schema, model } = mongoose;
const connectionString = 'mongodb+srv://moncadahenry93:l4RfabdBL4Y6AZ9Y@cluster0.dlb1osd.mongodb.net/chosenMP?retryWrites=true&w=majority'

mongoose.connect(connectionString)
    .then(()=>{
        console.log('databese connected');

    })
    .catch((err)=>{
        console.log(err);
    })

    