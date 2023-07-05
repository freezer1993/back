'use strict';

const conexion = require('../config/conexion');

const listarPrestadoresPorSucursal = async function (req, res) {
    let connection;
    const id_sucursal = req.params.id_sucursal;
    try {
    
    connection = await conexion.connect();
    // Realizar la consulta a la base de datos
    const query = `SELECT DISTINCT PR.ID_PRESTADOR nro,
                  PR.RAZ_SOC_NOMBRE || ' ' || PR.CONTACTO_APELLIDO nombre
                  FROM reserva_parametros r,
                  det_especialidad de,
                  especialidad es,
                  prestador pr
                  WHERE r.esp_id_especialidad = de.esp_id_especialidad
                  AND r.id_prestador = pr.id_prestador
                  AND de.esp_id_especialidad = es.id_especialidad
                  AND de.prest_id_prestador = pr.id_prestador
                  AND r.estado = 'ACTIVO'
                  AND r.id_sucursal = :id_sucursal
                  AND pr.estado_prestador = 'ACTIVO'
                  ORDER BY nombre ASC`;

    const result = await connection.execute(query, [id_sucursal]);
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
    // Retornar el resultado al cliente
    res.status(200).json({prestadores: rows});
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los prestadores por sucursal' });
  }finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error al cerrar la conexión:', error);
      }
    }
  }
};

const listarEspecialidadesPorSucursal = async function (req, res) {
    let connection;
    const id_sucursal = req.params.id_sucursal;
    
  try {
    // Validar que se reciba por el req el dato id_sucursal
    connection = await conexion.connect();
    // Realizar la consulta a la base de datos
    const query = `SELECT DISTINCT ES.ID_ESPECIALIDAD ID_ESPE,
                  ES.DESCRIPCION DESC_ESPECIALIDAD
                  FROM reserva_parametros r,
                  det_especialidad de,
                  especialidad es,
                  prestador pr
                  WHERE r.esp_id_especialidad = de.esp_id_especialidad
                  AND r.id_prestador = pr.id_prestador
                  AND de.esp_id_especialidad = es.id_especialidad
                  AND de.prest_id_prestador = pr.id_prestador
                  AND r.id_sucursal = :id_sucursal
                  AND r.estado = 'ACTIVO'`;

    const result = await connection.execute(query, [id_sucursal]);
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
    // Retornar el resultado al cliente
    res.status(200).json({especialidades: rows});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las especialidades por sucursal' });
  }finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error al cerrar la conexión:', error);
      }
    }
  }
};

const listarPrestadoresYEspecialidadesPorSucursal = async function (req, res) {
  let connection;  
  const id_sucursal = req.params.id_sucursal;
  let id_prestador = req.params.id_prestador;
  let id_especialidad = req.params.id_especialidad;

  // Verificar si las variables son ' ' o 'null' y asignarles el valor null
  if (id_sucursal === ' ' || id_sucursal === 'null') {
    id_sucursal = null;
  }
  if (id_prestador === ' ' || id_prestador === 'null') {
    id_prestador = null;
  }
  if (id_especialidad === ' ' || id_especialidad === 'null') {
    id_especialidad = null;
  }


  console.log('id_sucursal:'+id_sucursal);
  console.log('id_prestador:'+id_prestador);
  console.log('id_especialidad:'+id_especialidad);
  try {
    connection = await conexion.connect();
    // Realizar la consulta a la base de datos
    const query = `SELECT DISTINCT PR.ID_PRESTADOR ID_PRES,
                  PR.RAZ_SOC_NOMBRE || ' ' || PR.CONTACTO_APELLIDO DESC_PRESTADOR,
                  R.ESP_ID_ESPECIALIDAD ID_ESPECIALIDAD,
                  ES.DESCRIPCION DESC_ESPECIALIDAD
                  FROM reserva_parametros r,
                  det_especialidad de,
                  especialidad es,
                  prestador pr
                  WHERE r.esp_id_especialidad = de.esp_id_especialidad
                  AND r.id_prestador = pr.id_prestador
                  AND de.esp_id_especialidad = es.id_especialidad
                  AND de.prest_id_prestador = pr.id_prestador
                  AND r.id_sucursal = :id_sucursal
                  AND (de.esp_id_especialidad = :id_especialidad OR :id_especialidad IS NULL)
                  AND (de.prest_id_prestador = :id_prestador OR :id_prestador IS NULL)
                  AND r.estado = 'ACTIVO'`;

    const result = await connection.execute(query, {id_sucursal: id_sucursal,
        id_especialidad: id_especialidad,
        id_prestador: id_prestador});
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
    // Retornar el resultado al cliente
    res.status(200).json({data:rows});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los prestadores y especialidades por sucursal' });
  }finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error al cerrar la conexión:', error);
      }
    }
  }
};

const listarHorariosProfesionales = async function (req, res) {
    let connection;  
    const id_sucursal = req.params.id_sucursal;
    let id_prestador = req.params.id_prestador;
    let id_especialidad = req.params.id_especialidad;
  
    // Verificar si las variables son ' ' o 'null' y asignarles el valor null
    if (id_sucursal === ' ' || id_sucursal === 'null') {
      id_sucursal = null;
    }
    if (id_prestador === ' ' || id_prestador === 'null') {
      id_prestador = null;
    }
    if (id_especialidad === ' ' || id_especialidad === 'null') {
      id_especialidad = null;
    }
  
    try {
    connection = await conexion.connect();
    // Realizar la consulta a la base de datos
    const query = `SELECT SUCURSAL,
                  DIA,
                  DESDE,
                  HASTA,
                  DECODE(DIA,
                          'LUNES',
                          1,
                          'MARTES',
                          '2',
                          'MIERCOLES',
                          3,
                          'JUEVES',
                          4,
                          'VIERNES',
                          5,
                          'SABADO',
                          6) ORDEN
                  FROM (SELECT S.DESCRIPCION SUCURSAL, R.NOMBRE_DIA DIA,
                                 TO_DATE(TO_CHAR(R.HORA_DESDE), 'HH24:MI') HORA_DESDE,
                                 TO_CHAR(TO_DATE(TO_CHAR(R.HORA_DESDE, '99D00'), 'HH24:MI'), 'HH24:MI') DESDE,
                                 TO_CHAR(TO_DATE(TO_CHAR(R.HORA_HASTA, '99D00'), 'HH24:MI'), 'HH24:MI') HASTA
                          FROM reserva_parametros r,
                          det_especialidad de,
                          especialidad es,
                          prestador pr,
                          sucursal s
                          WHERE r.esp_id_especialidad = de.esp_id_especialidad
                          AND s.Id_Sucursal = r.id_sucursal
                          AND r.id_prestador = pr.id_prestador
                          AND de.esp_id_especialidad = es.id_especialidad
                          AND de.prest_id_prestador = pr.id_prestador
                          AND pr.id_prestador = :id_prestador
                          AND R.ESP_ID_ESPECIALIDAD = :id_especialidad
                          AND r.id_sucursal = :id_sucursal
                          AND r.estado = 'ACTIVO')
                  ORDER BY ORDEN ASC`;

    const result = await connection.execute(query, {id_sucursal: id_sucursal,
        id_especialidad: id_especialidad,
        id_prestador: id_prestador});
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
    // Retornar el resultado al cliente
    res.status(200).json({horarios:rows});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los horarios de los profesionales' });
  }finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error al cerrar la conexión:', error);
      }
    }
  }
};

module.exports = {
  listarPrestadoresPorSucursal,
  listarEspecialidadesPorSucursal,
  listarPrestadoresYEspecialidadesPorSucursal,
  listarHorariosProfesionales
};
