const { logger } = require('./loggin');
const dotenv = require('dotenv').config();
const { CONNECSTRING, USERADMIN, PASSADMIN, INSTANTCLIENT} = require('./config');
const oracledb = require('oracledb');
const NAMESPACE = 'conexion';
const { decrypt } = require('./crypto');

let connection;


oracledb.initOracleClient({ libDir: INSTANTCLIENT });

exports.connect= async function () {
   // var decrypted = decrypt(PASSADMIN);
    try {
        connection = await oracledb.getConnection({
            user: USERADMIN,
            password: PASSADMIN,
            connectString: CONNECSTRING
        });
        logger.info(`${NAMESPACE} - Conexión establecida`)
    } catch (err) {
        logger.error(`${NAMESPACE} - Error al conectar: ${err} user: ${USERADMIN}, conexion: ${CONNECSTRING}`)
    }
    return connection;
}
