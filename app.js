const express = require ('express')
const app = express()

//Middlewares
app.use(express.json())

//Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Auth Service API')
})

// Start Adding all of you routes under Here ▼

module.exports = app