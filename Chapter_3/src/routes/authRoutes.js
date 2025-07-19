import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'


const router = express.Router()

//to register a user using the data provided on request body
router.post('/register', (req, res) => {
    const {username, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 8)
    console.log(username, hashedPassword)
    


    // saving a new user into the database
    try {
        //create a user by saving password and username
        const insertUser = db.prepare(`INSERT INTO users (username, password)
            VALUES (?, ?)`)
            const result = insertUser.run(username, hashedPassword)
        /// allow new user to create first todo task
        const defaultTodo = `Hello :) please write down your first todo task`
        const insertTodo = db.prepare(`INSERT INTO todos (user_Id, task) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        //create a token to ensure the user is an autheticated one
        //const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24hrs'})
        const token = jwt.sign({ userId: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24hrs' })

        res.json({ token })


    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)

    }
})


// to login the user by compareing the saved information of the user before giving authtentication
router.post('/login', (req, res) => {
    const { username, password } = req.body

    try {
        //we are looking for the user in the database user
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`)
        const user = getUser.get(username)

            //settleing case where the suer is no where is not in the database
        if (!user) {
            return res.status(404).send('user not found')
        }

        //ensure the user logs in with the right password
        const passwordISvalid = bcrypt.compareSync(password, user.password)
        //confirming the password is invalid
        if(!passwordISvalid) {
            return res.status(401).send("Invalid Password")
        }
        console.log(user)

        //request for the token of the user after registration
        const token = jwt.sign({ userId: user.Id }, process.env.JWT_SECRET, { expiresIn: '24hrs' })

        //const token = jwt.sign({userid: user.Id}, process.env.JWT_SECRET, {expiresIn: '24hrs'})
        res.json({ token })

    } catch (err) {
        res.send(err.message)
        res.sendStatus(503)
    }

})

export default router

