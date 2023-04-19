require('./src/mongo.js')

const express = require('express');
var bodyParser = require("body-parser");
const cors = require('cors')
const app = express();
const path = require('path')

const port = process.env.PORT || 3001

app.use(cors());
app.use(bodyParser.json({limit: '11000kb'}));
app.use(express.json());
app.use(require('./src/routes/wvi'))
app.use(express.static(path.join(__dirname,'/src/public')))



app.use((req, res) => {
  return res.status(404).json({
    error: 'not found service reques'
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})