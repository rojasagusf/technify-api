'use strict';
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./src/routes');

const initializeApi = () => {
    app.use(cors());
    app.use(helmet());
    app.use(cookieParser());

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    Object.keys(routes).forEach((route) => {
        app.use('/api', routes[route]);
    });

    app.use(function(req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    return app;
};

module.exports = {
    initializeApi
};
