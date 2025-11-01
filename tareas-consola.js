const fs = require('fs');
const readline = require('readline');
const { Tarea } = require('./tarea');

// Inicializacion de readline para leer entradas de consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

// Funcion para guardar tareas en el archivo
function guardarTareas(tareas) {
    const data = tareas.map(tarea => `${tarea.id}|${tarea.tarea}|${tarea.estado}`).join('\n');
    fs.writeFileSync(ARCHIVO, data);
}

// Funcion del menu para elegir las opciones en la consola
function Menu() {
    console.log("Gestor de Tareas");
    console.log("1. Crear tarea");
    console.log("2. Eliminar tarea");
    console.log("3. Marcar tarea como completada");
    console.log("4. Listar tareas pendientes");
    console.log("5. Salir");

    rl.question("Ingrese el numero de la opcion deseada: ", (opcion) => {
        switch (opcion.trim()) {
            case '1':
                crearTarea();
                break;
            case '2':
                eliminarTarea();
                break;
            case '3':
                marcarTareaCompletada();
                break;
            case '4':
                listarTareasPendientes();
                break;
            case '5':
                console.log("Saliendo...");
                rl.close();
                break;
            default:
                console.log("Opcion no valida.");
                Menu();
        }
    });
}

// Funcion Crear Tarea, primero lee las tareas existentes para poder asignar un ID unico, luego guarda la nueva tarea en el archvo
function crearTarea() {
    rl.question("Describa la nueva tarea: ", (descripcion) => {
        let tareas = leerTareas();
        const nuevaTarea = new Tarea(tareas.length + 1, descripcion);
        tareas.push(nuevaTarea);
        guardarTareas(tareas);
        console.log("Tarea agregada correctamente");
        Menu();
    });
}

// Funcion Listar Tareas Pendientes, lee todas las tareas y luego filtra las pendientes por su estado
function listarTareasPendientes() {
    const tareas = leerTareas();
    console.log("Tareas pendientes:");
    const pendientes = tareas.filter(t => t.estado === 'pendiente');
    if (pendientes.length === 0) {
        console.log("No hay tareas pendientes");
    } else {
        pendientes.forEach(t => {
            console.log(`- [${t.id}] ${t.tarea}`);
        });
    }
    Menu();
}

// Funcion Eliminar Tarea, Si no hay tareas en el archivo, se avisa en la consola, si hay, usa el id para eliminar la tarea correspondiente
function eliminarTarea() {
    let tareas = leerTareas();
    if (tareas.length === 0) {
        console.log("No hay tareas para eliminar.");
        return Menu();
    }

    rl.question("Ingrese el ID de la tarea a eliminar: ", (id) => {
        const idNum = parseInt(id);
        const index = tareas.findIndex(t => t.id === idNum);
        if (index !== -1) {
            tareas.splice(index, 1);
            guardarTareas(tareas);
            console.log("Tarea eliminada correctamente");
        } else {
            console.log("Tarea no encontrada");
        }
        Menu();
    });
}

// Funcion Marcar Tarea como Completada, usa el id para buscar la tarea y actualzia su estado a "completado", si no hay tareas lo notifica en la consola
function marcarTareaCompletada() {
    let tareas = leerTareas();
    if (tareas.length === 0) {
        console.log("No hay tareas para marcar");
        return Menu();
    }

    rl.question("Ingrese el ID de la tarea completada: ", (id) => {
        const idNum = parseInt(id);
        const tarea = tareas.find(t => t.id === idNum);
        if (tarea) {
            tarea.estado = 'completada';
            guardarTareas(tareas);
            console.log("Tarea marcada como completada");
        } else {
            console.log("Tarea no encontrada");
        }
        Menu();
    });
}

//Inicia el menu al ejecutar el archivo
Menu();


//Para la creacion de este programa de consola separe la clase base de tarea en un archivo aparte para mantener un orden
//Tambien separe las funciones en modulos para facilitar su lectura y mantenimiento
//Uniendolo todo en un menu interactivo usando readline de node.js