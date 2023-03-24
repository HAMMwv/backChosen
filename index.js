require('./mongo.js')

const express = require('express');
var bodyParser = require("body-parser");
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3001;

const ChosenModel = require('./models/ChosenModel')


app.use(bodyParser.json({limit: '300kb'}));
app.use(cors());
app.use(express.json());

/**
 * retorta la lista de los posibles votantes
 */
// app.get('/api/posiblesVotantes', (req, res) => {
//   VoterAdmin.find()
//     .then((datos) => {
//       res.json(datos);
//     })
// })


/**
 * añade un votante a la lista votantes
 */
app.post('/api/chosenRegister', (req, res) => {
  const data = req.body;
  if (!data) {
    return res.status(400).json({
      error: 'chosen is missing'
    });
  }
  const chosen = new ChosenModel(req.body);
  chosen.save()
    .then(
      res.json({
        respuesta: 'Elegido Registrado'
      })
    )
    .catch((err) => {
      console.log(err);
    })
})



app.use((req, res) => {
  return res.status(404).json({
    error: 'not found service reques'
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})