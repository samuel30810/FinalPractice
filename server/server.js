'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/user/login',(req, res) => {
    const userInfo = req.body;
    console.log(userInfo);

    if (userInfo.loginName === 'abc' && userInfo.password === '123456') {
        return res.json({
            error: {
                code: 0,
                message: 'sucessful'
            },
            data: {
                loginName: 'abc',
                nickName: 'asdf'
            }
        });
    }

    return res.status(500).json({
        error: {
            code: 1001,
            message: 'login name and password are mismatched'
        }
    });
});

app.listen(4000, () => {
    console.log('server listened on 127.0.0.1:4000');
})