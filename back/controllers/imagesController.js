'use strict';

const fs = require('fs');
const path = require('path');
const multer = require('multer');

const port = process.env.PORT || 4201;

// Función middleware para recibir el parámetro id_sucursal en todas las peticiones
const setIdSucursal = (req, res, next) => {
  req.id_sucursal = req.query.id_sucursal; // Si el parámetro se pasa en la URL como ?id_sucursal=valor
  //req.id_sucursal = req.body.id_sucursal; // Si el parámetro se pasa en el cuerpo de la petición (requiere body-parser)

  // Puedes realizar validaciones adicionales aquí si es necesario

  next();
};

const folderPath = (id_sucursal) => `./public/slides/${id_sucursal}`;
//const folderPath = (id_sucursal) => `C:\\web\\back\\public\\slides\\${id_sucursal}`;

// Configuración de almacenamiento con Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const id_sucursal = req.id_sucursal;
    const fullPath = folderPath(id_sucursal);
    fs.mkdirSync(fullPath, { recursive: true });
    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

// Crear una instancia de Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5 MB
  },
});

// Controlador para guardar una imagen
const guardarImagen = upload.single('image'); // 'image' es el nombre del campo en el formulario

const listar_slides = async function (req, res) {
  const id_sucursal = req.id_sucursal;
  console.log(`id_sucursal:${id_sucursal}`);
  const fullPath = folderPath(id_sucursal);

  fs.readdir(fullPath, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer la carpeta de imágenes');
    } else {
      const imageLocations = files.map(file => `http://localhost:${port}/slides/${id_sucursal}/${file}`);
      console.log(imageLocations);
      res.json(imageLocations);
    }
  });
};

const listar_slides2 = async function (req, res) {
  const id_sucursal = req.id_sucursal;
  console.log(`id_sucursal:${id_sucursal}`);
  const fullPath = folderPath(id_sucursal);

  fs.readdir(fullPath, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer la carpeta de imágenes');
    } else {
      const imageList = files.map((file, index) => {
        const imageLocation = `http://localhost:${port}/slides/${id_sucursal}/${file}`;
        return {
          _id: index + 1, // Generar el _id basado en el índice
          location: imageLocation,
          file: file
        };
      });
      console.log(imageList);
      res.json(imageList);
    }
  });
};

// Resto del código sin cambios...

// Controlador para cargar una imagen
const uploadImage = (req, res) => {
  guardarImagen(req, res, (err) => {
    if (err) {
      // Manejar el error de carga de imagen
      return res.status(400).json({ error: 'Error al cargar la imagen' + err });
    }
    // La imagen se ha guardado correctamente
    return res.status(200).json({ message: 'Imagen guardada correctamente' });
  });
};

// Controlador para eliminar una imagen
const deleteImage = (req, res) => {
  const imageName = req.params.imageName;
  const id_sucursal = req.id_sucursal;
  console.log('Imagen: '+ imageName);
  const fullPath = folderPath(id_sucursal);
  // Ruta completa de la imagen a eliminar
  const imagePath = path.join(fullPath, imageName);
  console.log('imagenPath:' +imagePath);
  // Verificar si la imagen existe
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'La imagen no existe' });
  }

  // Eliminar la imagen
  fs.unlink(imagePath, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al eliminar la imagen' });
    }

    res.json({ success: true, message: 'Imagen eliminada correctamente' });
  });
};

module.exports = {
  setIdSucursal,
  listar_slides,
  uploadImage,
  deleteImage,
  listar_slides2
};
