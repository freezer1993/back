'use strict';
const conexion = require('../config/conexion');

const WebTexInfModel = {
  buscarRegistrosPorIdSucursal: async (idSucursal) => {
    let connection;

    try {
      connection = await conexion.connect();
      const query = 'SELECT * FROM anamnesis.WEB_TEX_INF WHERE id_sucursal = :idSucursal';
      const result = await connection.execute(query, [idSucursal]);
      // Obtener los nombres de los campos de la tabla
      const columnNames = result.metaData.map((column) => column.name.toLowerCase());

      // Mapear los resultados en un array de objetos con los nombres de los campos
      const rows = result.rows.map((row) => {
         const obj = {};
         columnNames.forEach((columnName, index) => {
            obj[columnName] = row[index];
         });
         return obj;
      });

      return rows;
    } catch (error) {
      console.error('Error al buscar registros por id_sucursal:', error);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error('Error al cerrar la conexión:', error);
        }
      }
    }
  },

  insertarRegistro: async (registro) => {
    let connection;

    try {
      connection = await conexion.connect();

      // Verificar si ya existe un registro con el mismo id_sucursal
      const existQuery = 'SELECT COUNT(*) AS count FROM anamnesis.WEB_TEX_INF WHERE id_sucursal = :idSucursal';
      const existResult = await connection.execute(existQuery, [registro.id_sucursal]);
      const count = existResult.rows[0].count;

      if (count > 0) {
        throw new Error('Ya existe un registro con el mismo id_sucursal.');
      }

      // Insertar el nuevo registro
      const query = `
        INSERT INTO anamnesis.WEB_TEX_INF (titulo, introduccion, cuerpo, id_sucursal)
        VALUES (:titulo, :introduccion, :cuerpo, :id_sucursal)
      `;
      const result = await connection.execute(query, registro);
      // Realizar el commit
      await connection.commit();
      return result.rowsAffected === 1;
    } catch (error) {
      console.error('Error al insertar registro:', error);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error('Error al cerrar la conexión:', error);
        }
      }
    }
  },

  modificarRegistroPorIdSucursal: async (idSucursal, nuevoRegistro) => {
    let connection;
    var id_sucursal = nuevoRegistro.id_sucursal;

    try {
      connection = await conexion.connect();

      // Verificar si existe un registro con el id_sucursal proporcionado
      const existQuery = 'SELECT COUNT(*) AS count FROM anamnesis.WEB_TEX_INF WHERE id_sucursal = :id_sucursal';
      const existResult = await connection.execute(existQuery, [id_sucursal]);
      const count = existResult.rows[0].count;

      if (count === 0) {
        throw new Error('No existe un registro con el id_sucursal proporcionado.');
      }

      // Modificar el registro
      const query = `
        UPDATE anamnesis.WEB_TEX_INF
        SET titulo = :titulo, introduccion = :introduccion, cuerpo = :cuerpo
        WHERE id_sucursal = :id_sucursal
      `;
      const result = await connection.execute(query, { ...nuevoRegistro, id_sucursal });

      // Realizar el commit
      await connection.commit();
      return result.rowsAffected === 1;
    } catch (error) {
      console.error('Error al modificar registro por id_sucursal:', error);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error('Error al cerrar la conexión:', error);
        }
      }
    }
  }
};

module.exports = WebTexInfModel;
