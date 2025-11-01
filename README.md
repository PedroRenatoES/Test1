# Proyecto de Tareas

Este proyecto contiene dos componentes principales:

1. **API RESTful**: Una API para gestionar tareas utilizando `Express.js`.
2. **Tareas por consola**: Una aplicación de consola para gestionar tareas localmente.

## Instrucciones para ejecutar

### 1. Instalar dependencias

Primero, debes instalar las dependencias necesarias. Ejecuta el siguiente comando en tu terminal dentro de la carpeta del proyecto:

npm install

### 2. Ejecutar el proyecto de API RESTful
Usando el siguiente comando

node tareas-api.js

Consta de los siguientes endpoints y body:


**Listar todas las tareas:**

Get: http://localhost:3000/tareas

**Listar una tarea en especifico**

Get: http://localhost:3000/tareas/idTarea


**Crear Tarea:**

Post: http://localhost:3000/tareas

{
    "tarea": "Cocinar"
}

**Marcar tarea como completada:**

Put: http://localhost:3000/tareas/idTarea

**Eliminar Tarea:**

Delete: http://localhost:3000/tareas/idTarea

### 2. Ejecutar la aplicación de tareas por consola

Utilizando el siguiente comando:

node tareas-consola.js
