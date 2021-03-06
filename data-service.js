const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {userSchema, exerciseSchema} = require('./schema.js');
const moment = require('moment');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())

const USER = new mongoose.model("User", userSchema);
const EXERCISE = new mongoose.model("Exercise", exerciseSchema);

  function inputUser(data, res) {
    let user = new USER({
        username: data.username
    })

     USER.findOne({username : data.username}, function (err, userFound){
        if(err) return console.error(err);
        if(!userFound){
            user.save(function (err, savedUser){
                if(err) return console.error(err);
                
               return res.json({username: savedUser.username, _id : savedUser.id}) 
            })
        }else{
            return res.json({username: userFound.username, _id : userFound.id})
        }
    })
    
}

function inputExercise(data, res){

    USER.findById({_id : data.id}, function (err, userFound){
        if(userFound){
        let exercise = new EXERCISE({
            description : data.description,
            duration : data.duration,
            date : data.date,
            eUid  : data.id
        })
        
        if(isNaN(Date.parse(exercise.date)))
            exercise.date =  new Date();
        else
            exercise.date = new Date(exercise.date);

        exercise.save(function (err, saveExercise){
            return res.json({
                username : userFound.username,
                description : saveExercise.description,
                duration : saveExercise.duration,
                date : moment(exercise.date).utcOffset("+08:00").format('ddd MMM DD YYYY'),
                _id :  data.id
            })
        });
    }
    })

}

function getAllUsers(res){
    USER.find({})
        .select('username _id')
        .exec(function (err, usersList){
            return res.json(usersList)
        })
}

function getUsersLogs(data, res){
    let fromDateData = new Date(data.from)
    let toDateData = new Date(data.to)
    let from =  new Date(moment(fromDateData).utcOffset("+08:00"))
    let to = new Date(moment(toDateData).utcOffset("+08:00"))
    let response = {};
    let limit = parseInt(data.limit);

    if(!limit){
        limit = 100;
    }
    
    if(isNaN(Date.parse(from))){
        let fromDate = new Date(0);
        from = new Date(moment(fromDate).utcOffset("+08:00"))
    }

    if(isNaN(Date.parse(to))){
       let toDate = new Date();
        to = new Date(moment(toDate).utcOffset("+08:00"))
    }

    if(isNaN(Date.parse(to)) && isNaN(Date.parse(from))){
       let fromDate = new Date(0);
        from = new Date(moment(fromDate).utcOffset("+08:00"))
       let toDate = new Date();
        to = new Date(moment(toDate).utcOffset("+08:00"))
    }

    USER.findById({_id : data.id}, function (err, userFound){
        console.log(limit , from.toDateString(), to.toDateString())
        if(!err && !userFound)
            return res.send("No User Found");
        else{
            EXERCISE.find({eUid : data.id, date : {$gte : from , $lte : to }})
            .limit(limit)
            .exec(function (err, execLogs) {
            if(execLogs){
              
                Promise.all(execLogs.map(function(l) { return {
                    description : l.description,
                    duration : l.duration,
                    date : moment(l.date).utcOffset("+08:00").format('ddd MMM DD YYYY')
                 }})).then( function (result){
                     response = {
                        username: userFound.username,
                        count: parseInt(execLogs.length),
                        _id: userFound.id,
                        log: result
                    }
                    return res.json(response)
                    
                 })
            
                 
            }
            })
        }
        
    })
    
    
}

function deleteAllUsers(res){
    USER.deleteMany({}, function (err, userFound){
        if(!err)
            return res.redirect("/")
    })
}

function deleteAllExercises(res){
    EXERCISE.deleteMany({}, function (err, userFound){
        if(!err)
            return res.redirect("/")
    })
}

exports.inputUser = inputUser;
exports.inputExercise = inputExercise;
exports.getAllUsers = getAllUsers;
exports.deleteAllUsers = deleteAllUsers;
exports.deleteAllExercises = deleteAllExercises;
exports.getUsersLogs = getUsersLogs;