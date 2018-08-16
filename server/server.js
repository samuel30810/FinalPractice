'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

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

const Task = connection.define('task',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    task_content:{
        type: Sequelize.STRING,
    }
})

const Done = connection.define('done',{
    done_content:{
        type: Sequelize.STRING,
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
    const todo = await Task.findAll({raw:true,attributes:['id','content','status']})
    console.log(todo);

    return res.json({
        data: todo
    })
})

app.post('/user/task/done', async (req, res) =>{
    const done = await Done.findAll({raw:true,attributes:['id','done_content']})

    return res.json({
        data: done
    })
})

app.post('/user/task/add', async (req, res) =>{
    const taskAdd = req.body;
    console.log(taskAdd);

    Task.create({
        task_content: taskAdd.taskAdd
    })
    const id = await Task.findAll({raw:true,attributes:['id'],where:{task_content: taskAdd.taskAdd}})

    return res.json({
        data:taskAdd.taskAdd,
        id: id
    })
})

app.post('/user/task/drop', async (req, res) =>{
    const drop = req.body;
    console.log(drop);


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
