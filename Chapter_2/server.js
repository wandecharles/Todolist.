const express = require('express')
const app = express()

//const PORT = 8383

let data = ['wande', 'wole']

//console.log(data)

app.use(express.json())

app.get('/', (req, res) => {
    console.log('yes it is on')
    res.send(`<body>
        <h1>This is the homepage</h1>
        <a href="/dashboard">Dashboard</a>
        </body>`);
})


app.get('/dashboard', (req, res) => {
    res.send(`<body>
        <h1>Dashboard</h1>
        <a href="/">Homepage</a>
        </body>`)
})

app.get('/api/data', (req, res) => {
    console.log('this was for data')
    console.log(data)
    res.json(data)
})


app.post('/api/data', (req, res) => {
    const newEntry = req.body
    console.log('Received:', newEntry)

    /*
    if (!newEntry || !newEntry.name) {
        return res.status(400).send('Missing name in request body')
    }
*/
    data.push(newEntry.name)
    console.log('Updated data:', data)

    res.sendStatus(201)
})


app.delete('/api/data', (req, res) => {
    data.pop()
    console.log('the last element of the array was deleted out')
    console.log(data)
    res.status(203)
})


/*
app.post('/api/data', (req, res) => {
    const newEntry = req.body
    console.log(newEntry)
    data.push(newEntry.name)
    res.sendStatus(201)
   // res.send(newEntry)
})
*/
function errorHandler(err, req, res, next) {
    res.send('<h1>There was an error. Please try again</h1>')
}

app.use(errorHandler)

//app.listen(PORT, () => console.log(`Server has started on: ${PORT}`))
