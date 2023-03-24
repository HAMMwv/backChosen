const mongoose = require('mongoose')
const { Schema, model } = mongoose;
const connectionString = 'mongodb+srv://moncadahenry93:l4RfabdBL4Y6AZ9Y@cluster0.dlb1osd.mongodb.net/chosen?retryWrites=true&w=majority'

mongoose.connect(connectionString)
    .then(()=>{
        console.log('databese connected');

    })
    .catch((err)=>{
        console.log(err);
    })





// VoterAdmin.find({})
//     .then((datos)=>{
//         console.log(datos);
//         mongoose.connection.close();
//     })
//     .catch((err)=>{
//         console.log(err);
//         mongoose.connection.close();
//     })


// const voterAdmin = new VoterAdmin({
//     documento: 51993888,
//     estate: 'Personal Administrativo',
//     date: new Date,
//     votoAsamGeneral: 'Voto En Blanco',
// })

// voterAdmin.save()
//     .then((datos)=>{
//         console.log(datos);
//         mongoose.connection.close();
//     })
//     .catch((err)=>{
//         console.log(err);
//         mongoose.connection.close();
//     })