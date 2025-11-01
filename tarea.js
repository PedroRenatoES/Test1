//Clase base usada para la creacion de nuevas tareas
export class Tarea {
    constructor(id, tarea, estado = 'pendiente') {
        this.id = id;
        this.tarea = tarea;
        this.estado = estado;
    }
}