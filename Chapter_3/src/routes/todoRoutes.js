

import express from 'express'
import db from '../db.js'

const router = express.Router()


// get all todos tasks for a logged in user
router.get('/', (req, res) => { 

    if (!req.userId) {
        res.status(404).json({err: 'user not allowed'})
    }

    try {
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_Id = ?')
    const todos = getTodos.all(req.userId)
    res.json(todos)
    } catch {
        if (err) {
            console.error({err: 'error fetching user todos'}, err.message)
            res.status(500).json({err: 'failed fetching todos'})
        }
    }
})

//create a new todo
router.post('/', (req, res) => {
    const task = req.body?.task
    if(!task || typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({err: 'task is required'})
   }
   
   if (!req.userId) {
    return res.status(401).json({ error: 'User not authenticated' })
}
    //assign the user's task into a variable from the request body
   try{
    //const { task } = req.body 
    //then we prepare a database instance to include the user's new task into the database todos
    const insertTodo = db.prepare(`INSERT INTO todos (user_Id, task) VALUES (?, ?)`)
    //then we run the instance via node 
    const result = insertTodo.run(req.userId, task)
    //then we create a response from the server to show that the task was included
    console.log('Adding task for userId:', req.userId)
    res.json({ id: result.lastInsertRowid, task, completed: false })}
    catch (err) {
        console.log('error:', err.message)
        res.status(500).json({error: 'todo was not added'})
    }
 })

//update a new todo
router.put('/:id', (req, res) => { 

    const id = parseInt(req.params.id)
    const { userId } = req.body
        //const { userId } = req.body
    const { task, completed } = req.body

    console.log('Incoming request body:', req.body);
    console.log('Parsed ID:', id);
    console.log('User ID from middleware:', req.userId);

    if (!req.userId) {
    return res.status(401).json({ error: 'User not authenticated' })}
    
    if (!task && typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Task or completed status is required' });
    }
    
    
    try {
        const updateTodo = db.prepare(`UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_Id = ?`)

        console.log('Running SQL:', `
            UPDATE todos 
            SET task = '${task}', completed = ${completed} 
            WHERE id = ${id} AND user_Id = '${req.userId}'
        `);

        
        const result = updateTodo.run(task, completed, id, req.userId)

        if (result.changes === 0) {
            return res.status(404).json({err: 'user not authorized or found'})
        }
        res.json({ success: true, updatedId: id })
    }
    catch (err) {
        console.error('Database error:', err)
        res.status(403).json({err: 'failed to update todo'})
    }
})

//delete a new todo
router.delete('/:id', (req, res) => {

    const id = parseInt(req.params.id)
    

    console.log('User ID from middleware:', req.userId);

    if (!req.userId) {
    return res.status(401).json({ error: 'User not authenticated' })}


    try {
        const deleteTodo = db.prepare(`DELETE FROM todos WHERE user_Id = ? AND id = ?`)
        
        const result = deleteTodo.run(id, req.userId);

        if (result.changes === 0) {
        return res.status(404).json({ err: 'Todo not found or unauthorized' });
        }
        res.json({ success: true, message: 'Todo deleted successfully' });

        console.log('Running SQL:', `
            DELETE todos 
            WHERE id = ${id} AND user_Id = '${req.userId}'
        `);

    } catch (err) {
        console.error({err: 'Could not delete todo'})
        res.status(403).json({err: 'failed to delete todo'})
    }
 })


export default router