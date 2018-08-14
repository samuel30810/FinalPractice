'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
var account = [];
var password = [];
var trueAcc = 'init';

const app = express();
const connection = new Sequelize('sequelize','root','samuel0123',{dialect: 'mysql'});

app.use(bodyParser.json());

const User = connection.define('user',{ 
    firstName:{ 
        type: Sequelize.STRING, 
    }, 
    lastName: { 
        type: Sequelize.STRING, 
    } 
}); 

connection
    .authenticate()
    .then(() => {
        console.log('connect');
    })
    .catch(err =>{
        console.log('fail');
    })

// connection.authenticate().then(() => {
//     User.findAll({raw:true,attributes:['firstName','lastName']}).then(users =>{
//         console.log(users);
//         account = users;
//     })
// })

// connection.query("select firstName from users").then(select =>{
//     account = select;
//     // console.log(account);
// })
// connection.query("select lastName from users").then(select =>{
//     password = select;
//     //console.log(password);
// })
// account.forEach(function(e){
//     if (e.firstName == userInfo.loginName) {
//         console.log('find');
//     }else {
//         console.log(e);
//         console.log('fail');
//     }
// })
// connection.query("select firstName from users where firstName = 'a'").then(select =>{
//     console.log(select);
// })

app.post('/user/login', (req, res) => {
    const userInfo = req.body;
    console.log(userInfo);

    connection.authenticate().then(() => {
        User.findAll({raw:true,attributes:['firstName','lastName'],where:{firstName: userInfo.loginName,lastName: userInfo.password}}).then(users =>{
            console.log(users);
            if (users.length === 0) {
                console.log('fail');
                return res.status(500).json({
                    error: {
                        code: 1001,
                        message: 'Login name and password are mismatched'
                    }
                });
            }else {
                console.log('success!');
                return res.json({
                    error: {
                        code: 0,
                        message: 'Successful'
                    },
                    data: {
                        loginName: 'abc',
                        nickName: 'djklafal'
                    }
                });
            }
        })
    })
});

app.listen(4000, () => {
    console.log('Server listened on 127.0.0.1:4000');
});