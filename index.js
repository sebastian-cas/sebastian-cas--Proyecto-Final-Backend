import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { ObjectId } from 'mongodb'
import dbClient from './db.js'

const app = express()

// permite recibir datos en el body
app.use(bodyParser.json())
app.use(cors())

// DB info
const dbName = 'task_app'
const tasksCollectionName = 'tasks'


// Obtener Todo
app.get('/api/v1/tareas', async (req, res) => {

    const estado = req.query.estado
    // console.log(estado)

    // 1. Conexion a la DB
    await dbClient.connect()
    // 2. Seleccionar la DB
    const taskAppDB = dbClient.db(dbName)
    // 3. Seleccionar la coleccion
    const tasksCollection = taskAppDB.collection(tasksCollectionName)

    let filtro = {}
    if (estado === 'activa' || estado === 'inactiva' || estado === 'finalizada') {
        filtro = { estado: estado }
    }

    // 4. Realizar la query
    const taskList = await tasksCollection.find(filtro, {
        projection: {
            titulo: true,
            responsable: true,
            estado: true,
        }
    }).toArray()

    // 5. Cerrar conexion
    await dbClient.close()

    res.json({
        message: 'documentos entregados',
        data: taskList
    })
})

// Obtener Uno
app.get('/api/v1/tareas/:id', async (req, res) => {

    let id = req.params.id

    // 1. Conexion a la DB
    await dbClient.connect()
    // 2. Seleccionar la DB
    const taskAppDB = dbClient.db(dbName)
    // 3. Seleccionar la coleccion
    const tasksCollection = taskAppDB.collection(tasksCollectionName)

    // 4. Realizar la query
    id = new ObjectId(id)
    const tarea = await tasksCollection.findOne({_id: id})


    // 5. Cerrar conexion
    await dbClient.close()


    res.json({
        message: 'documento entregado',
        data: tarea
    })
})

// Crear
app.post('/api/v1/tareas', async (req, res) => {

    const taksData = req.body
    console.log(taksData)

    // 1. Conexion a la DB
    await dbClient.connect()
    // 2. Seleccionar la DB
    const taskAppDB = dbClient.db(dbName)
    // 3. Seleccionar la coleccion
    const tasksCollection = taskAppDB.collection(tasksCollectionName)

    // 4. Realizar la query
    await tasksCollection.insertOne({
        titulo: taksData.titulo,
        descripcion: taksData.descripcion,
        responsable: taksData.responsable,
        estado: "inactiva"
    })

    // 5. Cerrar conexion
    await dbClient.close()


    res.json({
        message: 'documento creado'
    })
})

// Editar
app.put('/api/v1/tareas/:id', async (req, res) => {

    const taskData = req.body
    let id = req.params.id

    // 1. Conexion a la DB
    await dbClient.connect()
    // 2. Seleccionar la DB
    const taskAppDB = dbClient.db(dbName)
    // 3. Seleccionar la coleccion
    const tasksCollection = taskAppDB.collection(tasksCollectionName)

    id = new ObjectId(id)
    
    let modificacion = {}
    if (taskData.titulo) {
        modificacion.titulo = taskData.titulo
    }
    if (taskData.estado) {
        modificacion.estado = taskData.estado
    }
    if (taskData.descripcion) {
        modificacion.descripcion = taskData.descripcion
    }
    if (taskData.responsable) {
        modificacion.responsable = taskData.responsable
    }


    // 4. Realizar la query
    await tasksCollection.updateOne(
        { _id: id },
        {
            $set: modificacion
        }
    )



    // 5. Cerrar conexion
    await dbClient.close()

    res.json({
        message: 'documento editado'
    })
})

// Eliminar
app.delete('/api/v1/tareas/:id', async (req, res) => {

    let id = req.params.id

    // 1. Conexion a la DB
    await dbClient.connect()
    // 2. Seleccionar la DB
    const taskAppDB = dbClient.db(dbName)
    // 3. Seleccionar la coleccion
    const tasksCollection = taskAppDB.collection(tasksCollectionName)

    // 4. Realizar la query
    id = new ObjectId(id)
    await tasksCollection.deleteOne({_id: id})

    // 5. Cerrar conexion
    await dbClient.close()

    res.json({
        message: 'documento eliminado'
    })
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`API escuchando en el puert: ${PORT}`)
})