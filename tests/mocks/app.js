'use strict';
const models = require('../../src/models');
const {initializeApi} = require('../../app');
const logger = require('../../src/utils/logger');

function initDb() {
    return models
        .initDatabase()
        .then(() => {
            return initializeApi();
        })
        .catch((error) => {
            logger.error('APP STOPPED');
            logger.error(error.stack);
            return process.exit(1);
        });
}

function start() {
    return initializeApi();
}

function finish() {
    return models.removeAllDatabase();
}

module.exports = {
    start,
    finish,
    initDb
};
