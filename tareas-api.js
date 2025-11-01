const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const { Tarea } = require('./tarea');

// Middleware para parsear el body de las peticiones a formato json
app.use(express.json());

// Archivo donde se guardan las tareas
const ARCHIVO = 'tareas.txt';

// Funcion para leer las tareas desde el archivo y devolverlas como un array de objetos
function leerTareas() {
    if (!fs.existsSync(ARCHIVO)) {
        return [];
    }
    const data = fs.readFileSync(ARCHIVO, 'utf8');
    const lineas = data.split('\n');
    const tareas = lineas.map(linea => {
        const partes = linea.split('|');
        return {
            id: parseInt(partes[0]),
            tarea: partes[1],
            estado: partes[2] || 'pendiente'
        };
    });
    return tareas;
}

// Funcion para guardar tareas en el archivo siguiendo el formato de ID|TAREA|ESTADO
function guardarTareas(tareas) {
    const data = tareas.map(tarea => `${tarea.id}|${tarea.tarea}|${tarea.estado}`).join('\n');
    fs.writeFileSync(ARCHIVO, data);
}

// Rutas de la API

// Obtener todas las tareas pendientes registradas en el archivo (GET)
app.get('/tareas', (req, res) => {
    const tareas = leerTareas();
    const pendientes = tareas.filter(t => t.estado === 'pendiente');
    res.status(200).json(pendientes);
});

// Obtener una tarea especifica filtrando por el id deseado (GET)
app.get('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const tareas = leerTareas();
    const tarea = tareas.find(t => t.id === parseInt(id));

    if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.status(200).json(tarea);
});

// Crear una nueva tarea que mantiene el estado pendiente por defecto (POST)
app.post('/tareas', (req, res) => {
    const { tarea } = req.body;
    if (!tarea) {
        return res.status(400).json({ error: 'Se requiere la descripcion de la tarea' });
    }

    const tareas = leerTareas();
    const nuevaTarea = new Tarea(tareas.length + 1, tarea);
    tareas.push(nuevaTarea);
    guardarTareas(tareas);
    res.status(201).json(nuevaTarea);
});

// Eliminar tarea filtrando por el id (DELETE)
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    let tareas = leerTareas();
    const index = tareas.findIndex(t => t.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    tareas.splice(index, 1);
    guardarTareas(tareas);
    res.status(200).json({ message: 'Tarea eliminada correctamente' });
});

// Marcar tarea como completada editando su estado a completado (PUT)
app.put('/tareas/:id', (req, res) => {
    const { id } = req.params;
    let tareas = leerTareas();
    const tarea = tareas.find(t => t.id === parseInt(id));

    if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    tarea.estado = 'completada';
    guardarTareas(tareas);
    res.status(200).json(tarea);
});

// Iniciar el servidor de la api
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});


// Para la creacion de esta API utilice node.js con el framework express
// Separe la clase base de tarea en un archivo aparte para poder importarla en este archivo y en el de la consola
// Las funciones separan la logica de negocio (la escritura y lectura de archivos) de las rutas de la API