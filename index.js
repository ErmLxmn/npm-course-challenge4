const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const connection = require('./mongodb.js');
const bodyParser = require('body-parser');
const {inputUser, inputExercise} = require('./data-service.js');

connection.START_CONNECTION();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", function (req, res){
  inputUser({username : req.body.username}, function(response){
      res.json(response)
  });
})

app.post("/api/users/:_id/exercises", function (req, res){
  let data = {
    id : req.params._id,
    description : req.body.description,
    duration :  req.body.duration,
    date :  req.body.date
  }
  
  inputExercise(data, function (response){
    res.json(response)
  });
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
