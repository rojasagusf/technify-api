'use strict';
const {Sequelize} = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const db = {};
const DATABASE_MAX_ATTEMPTS = process.env.DATABASE_MAX_ATTEMPTS;
const DATABASE_INTERVAL_CONNECTION = process.env.DATABASE_INTERVAL_CONNECTION;
let modelsDependsOn = {};

const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'mysql',
    omitNull: true,
    pool: {
        max: 6,
        min: 0,
        acquire: 40000,
        idle: 10000
    }
});

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 &&
			file !== basename &&
			file.slice(-3) === '.js' &&
			file.indexOf('.test.js') === -1
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

function waitInterval(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}

const connectToDB = async() => {
    let attemp = 0;
    let isConnected = false;

    const tryConnection = async() => {
        try {
            await sequelize.authenticate();
            isConnected = true;
        } catch (_error) {
            await waitInterval(DATABASE_INTERVAL_CONNECTION);
            attemp++;
            if (attemp < DATABASE_MAX_ATTEMPTS) {
                await tryConnection();
            }
        }
    };

    await tryConnection();

    if (!isConnected) {
        throw new Error();
    }
};

async function removeModelsByDependences(pendingModels) {
    const toProcess = pendingModels.filter((model) => {
        let waitForMe = pendingModels.filter((elem) => {
            return modelsDependsOn[elem].includes(model);
        });
        return waitForMe.length === 0;
    });

    if (toProcess.length === 0) {
        return null;
    }
    await Promise.all(
        toProcess.map((model) => {
            return db[model].destroy({
                truncate: {
                    cascade: true
                },
                restartIdentity: true
            });
        })
    );
    const newPendingModels = pendingModels.filter((model) => {
        return !toProcess.includes(model);
    });
    return removeModelsByDependences(newPendingModels);
}
function removeAllDatabase() {
    let pendingModels = Object.keys(modelsDependsOn);
    return removeModelsByDependences(pendingModels);
}

db.connection = sequelize;
db.initDatabase = connectToDB;
db.removeAllDatabase = removeAllDatabase;
db.removeModelsByDependences = removeModelsByDependences;

module.exports = db;
