const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {userSchema, exerciseSchema} = require('./schema.js');

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
            exercise.date =  new Date().toDateString();
        else
            exercise.date = new Date(exercise.date).toDateString();

        exercise.save(function (err, saveExercise){
            return res.json({
                username : userFound.username,
                description : exercise.description,
                duration : exercise.duration,
                date : new Date(l.date).toDateString(),
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
   
    let from = new Date(data.from)
    let to = new Date(data.to)

    if(isNaN(Date.parse(from))){
        from = new Date(0);
    }
    if(isNaN(Date.parse(to))){
        to = new Date();
    }

    USER.findById({_id : data.id}, function (err, userFound){
        let limit = parseInt(data.limit);
        if(userFound){
            EXERCISE.find({eUid : data.id, date : {$gte : from , $lte : to }})
            .limit(limit)
            .exec(function (err, execLogs) {
            if(execLogs){
                return res.json({
                    username: userFound.username,
                    count: execLogs.length,
                    _id: data.id,
                    log: execLogs.map((l) =>{ return {
                        description : l.description,
                        duration : l.duration,
                        date : new Date(l.date).toDateString()
                     }})
                     
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