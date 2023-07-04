'use strict';
const conexion = require('../config/conexion');

const AdminModel = {
   findAdminByEmail: async (email) => {
      let connection;

      try {
         connection = await conexion.connect();
         const query = 'SELECT * FROM anamnesis.WEB_ADMIN WHERE email = :email';
         const result = await connection.execute(query, [email]);
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
         console.error('Error al buscar administrador por email:' + email, error);
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

   getAdminByEmail: async (email) => {
      let connection;

      try {
         connection = await conexion.connect();
         const query = 'SELECT nombres, apellidos, telefono, rol, ci FROM anamnesis.WEB_ADMIN WHERE email = :email';
         const result = await connection.execute(query, [email]);
         return result.rows;
      } catch (error) {
         console.error('Error al obtener administrador por email:', error);
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

   insertAdmin: async (adminData) => {
      let connection;

      try {
         connection = await conexion.connect();

         const query = `
        INSERT INTO anamnesis.WEB_ADMIN (nombres, apellidos, email, password, telefono, rol, ci)
        VALUES (:nombres, :apellidos, :email, :password, :telefono, :rol, :ci)
      `;
         const result = await connection.execute(query, adminData);
         return result.rowsAffected === 1;
      } catch (error) {
         console.error('Error al insertar administrador:', error);
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

module.exports = AdminModel;
