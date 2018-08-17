'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
var session = require('express-session');

const app = express();
const connection = new Sequelize('sequelize','root','samuel0123',{dialect: 'mysql'});

app.use(bodyParser.json());
app.use(session({
    secret: '123',
    resave: true,
    saveUninitialized: true,
}))

// const newId = Task.findAll({attributes:[[sequelize.fn('count',sequelize.col('hat'),'no_hats')]]})

// connection.query("select * from users where firstName = 'a' and lastName = 'a'",
// { type: Sequelize.QueryTypes.SELECT}).then(select =>{
//     console.log(select);
//     console.log(select.length);
// })

const User = connection.define('user',{ 
    firstName:{ 
        type: Sequelize.STRING, 
    }, 
    lastName: { 
        type: Sequelize.STRING, 
    } 
}); 

const Task = connection.define('task',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    content:{
        type: Sequelize.STRING,
    },
    status:{
        type: Sequelize.INTEGER
    }
})



connection.authenticate()
    .then(() => {
        console.log('connect');
    })
    .catch(err =>{
        console.log('fail');
    })

app.post('/user/login', (req, res) => {
    const userInfo = req.body;
    console.log(userInfo);

    connection.authenticate().then(() => {
        User
        .findAll({raw:true,attributes:['firstName','lastName'],where:{firstName: userInfo.loginName,lastName: userInfo.password}})
        .then(users =>{
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
                req.session.login = userInfo.loginName;
                console.log(req.session.login);
                return res.json({
                    error: {
                        code: 0,
                        message: 'Successful'
                    },
                });
            }
        })
    })
});

app.post('/user/signup/account', (req, res) =>{
    const userAccount = req.body;
    console.log(userAccount);

    User.findAll({raw:true,attributes:['firstName'],where:{firstName: userAccount.account}})
    .then(users =>{
        if (users.length === 0) {
            return res.json({
                error: {
                    code: 0,
                    message: 'successful '
                }
            })
        }else {
            return res.status(498).json({
                error: {
                    code: 1001,
                    message: 'account is exist'
                }
            })
        }
    })
});

app.post('/user/signup/password', (req, res) =>{
    const userSignup = req.body;
    console.log(userSignup);

    connection.authenticate().then(() =>{
        if (userSignup.password === userSignup.checkPassword) {
            User.create({
                firstName: userSignup.account,
                lastName: userSignup.password
            })
            return res.json({
                error: {
                    code: 0,
                    message: 'successful'
                }
            })
        }else {
            return res.status(499).json({
                error: {
                    code: 1001,
                    message: 'password was not same as checkpassword'
                }
            })
        }
    })
});

app.post('/user/task/todo', async (req, res) => {
    console.log(req.session.login);
    if (req.session.login === 'a') {
        console.log('successsuccess');
    }
    else{
        console.log('failfail');
    }
    const todo = await Task.findAll({raw:true,attributes:['id','content','status']})
    console.log(todo);

    return res.json({
        data: todo
    })
})

app.post('/user/task/add', async (req, res) =>{
    const taskAdd = req.body;

    const create_item = await Task.create({
        content: taskAdd.taskAdd,
        status:1,
    })

    console.log(create_item);

    return res.json({
        content: create_item
    })
})

app.post('/user/task/move', async (req, res) =>{
    const id = req.body;
    var statusNum = 0;
    const oldStatus = await Task.findAll({raw:true,attributes:['status'],where:{id:id.id}});//[{ status: 2}]
    const content = await Task.findAll({raw:true,attributes:['id','content','status'],where:{id:id.id}});
    oldStatus.forEach(e => {
        console.log(e.status);
        statusNum = e.status;
    })
    if (statusNum === 1) {
        Task.update({status: 2},{'where':{'id':id.id}})
    }else {
        Task.update({status: 1},{'where':{'id':id.id}})
    }
    return res.json({
        status: statusNum,
        content: content,
    })
})

app.listen(4000, () => {
    console.log('Server listened on 127.0.0.1:4000');
});

// connection.authenticate().then(() => {
//     User.findAll({raw:true,attributes:['firstName','lastName']}).then(users =>{
//         console.log(users);
//         account = users;
//     })
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
