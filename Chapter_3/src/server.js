//const express = require('express')
import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'
import dotenv from 'dotenv'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 4000

// get the file path from the current module
const __filename = fileURLToPath(import.meta.url)

//get the directory name from the file path
const __dirname = dirname(__filename)

app.use(express.json())
dotenv.config()

app.use(cors())


//routes 
app.use('/auth', authRoutes)

app.use('/todos', authMiddleware, todoRoutes)

app.use(express.static(path.join(__dirname, '../public')))

/*app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
*/

function errorHandler(err, req, res, next) {
    console.error('🚨 Server Error:', err.message)
    res.status(500).json({ error: 'Internal Server Error', details: err.message })
}




app.use(errorHandler)



app.listen(PORT, () => { console.log(`Server has started on ${PORT}`)})