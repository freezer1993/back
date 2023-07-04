const dotenv = require('dotenv').config()
const fs = require('fs')
const { logger } = require('./loggin')
const NAMESPACE = 'config'

var PUERTO, CONNECSTRING, PASSWORD;
let sessionFile;

const ENVIROMENT = process.env.NODE_ENV;
const API_KEY = process.env.KEY;
const IV = process.env.IV;
const USERADMIN = process.env.USER_ADMIN; 
const PASSADMIN = process.env.PASS_ADMIN; 
CONNECSTRING = process.env.CONECCSTRING_PROD;
PUERTO = process.env.PORTPROD;
//generar archivo de manejo de tokens y usuarios
const createSessionsFileIfNotExists = function(file) {
    sessionFile = file;
    if (!fs.existsSync(sessionFile)) {
        try {
            fs.writeFileSync(sessionFile, JSON.stringify([]));
            logger.info(`${NAMESPACE} - CREATE-SESSION-FILE: Sessions file created successfully.`)
        } catch (err) {
            logger.error(`${NAMESPACE} - CREATE-SESSION-FILE: Failed to create sessions file: ${err}`)
        }
    } else {
        if (ENVIROMENT == 'production') {
            fs.writeFileSync(sessionFile, JSON.stringify([]));
        }
    }
}

const setSessionsFile = function(sessions) {
    fs.writeFile(sessionFile, JSON.stringify(sessions), function(err) {
        if (err) {
            logger.error(`${NAMESPACE} - SET-SESSION-FILE: Failed to create sessions file: ${err}`)
        }
    });
}

const getSessionsFile = function() {
    return JSON.parse(fs.readFileSync(sessionFile));
}


module.exports = {
    PUERTO,
    ENVIROMENT,
    CONNECSTRING,
    API_KEY,
    IV,
    PASSADMIN,
    USERADMIN,
    createSessionsFileIfNotExists,
    setSessionsFile,
    getSessionsFile
};