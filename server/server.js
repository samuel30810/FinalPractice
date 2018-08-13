'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/user/login', (req, res) => {
    const userInfo = req.body;
    console.log(userInfo);

    if ( userInfo.loginName === 'a' && userInfo.password === 'a' ) {
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

    return res.status(520).json({
        error: {
            code: 1001,
            message: 'Login name and password are mismatched'
        }
    });
});

app.listen(4000, () => {
    console.log('Server listened on 127.0.0.1:4000');
});