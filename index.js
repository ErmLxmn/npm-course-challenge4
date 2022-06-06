const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const connection = require('./mongodb.js');
const bodyParser = require('body-parser');
const {inputUser, inputExercise} = require('./data-service.js');
const mySecret = process.env['MONGO_URI']

connection.START_CONNECTION();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", function (req, res){
  res.json( inputUser({username : req.body.username}))
})

app.post("/api/users/:_id/exercises", function (req, res){
  let data = {
    id : req.params._id,
    description : req.body.description,
    duration :  req.body.duration,
    date :  req.body.date
  }
    
  res.json(inputExercise(data))
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
