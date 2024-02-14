const { logger } = require('./loggin');
const dotenv = require('dotenv').config();
const { CONNECSTRING, USERADMIN, PASSADMIN, INSTANTCLIENT, INSTANT_CLIENT_LINUX, SERVER} = require('./config');
const oracledb = require('oracledb');
const NAMESPACE = 'conexion';
const { decrypt } = require('./crypto');

let connection;

if (SERVER==='WINDOWS'){
   oracledb.initOracleClient({ libDir: INSTANTCLIENT });
}

exports.connect= async function () {
   // var decrypted = decrypt(PASSADMIN);
    if (SERVER='WINDOWS'){
        try {
            connection = await oracledb.getConnection({
                user: USERADMIN,
                password: PASSADMIN,
                connectString: CONNECSTRING
            });
            logger.info(`${NAMESPACE} - Conexión establecida`);
            return connection;
        } catch (err) {
            logger.error(`${NAMESPACE} - Error al conectar: ${err} user: ${USERADMIN}, conexion: ${CONNECSTRING}`);
            throw new Error(`${NAMESPACE} - Error al conectar: ${err} user: ${USERADMIN}, conexion: ${CONNECSTRING}`);
        }
    } else if (SERVER='LINUX'){
        try {
            process.env.LD_LIBRARY_PATH=INSTANT_CLIENT_LINUX;
            connection = await oracledb.getConnection({
                user: USERADMIN,
                password: PASSADMIN,
                connectString: CONNECSTRING
            });
            logger.info(`${NAMESPACE} - Conexión establecida`);
            return connection;
        } catch (err) {
            logger.error(`${NAMESPACE} - Error al conectar: ${err} user: ${USERADMIN}, conexion: ${CONNECSTRING}`);
            throw new Error(`${NAMESPACE} - Error al conectar: ${err} user: ${USERADMIN}, conexion: ${CONNECSTRING}`);
        }
    }

}
