const express = require('express')
require('./db/mongoose')
const User = require('./models/user')

const app = express()

const port = process.env.port || 3000;


// Automatically parse inconing json into an object that can be accessed in req handlers.
app.use(express.json())

// Create new user.
app.post('/users', (req, res) => {
    console.log(req.body)

    // create the new user
    const user = new User(req.body)

    user.save().then(() => {
        res.status(201).send(user)
    }).catch((err) => { 
        res.status(400).send("An error occured while adding user: " + err)
    })
})

// Get all users.
app.get('/users', (req, res) => {
    User.find({
        // fetch all users.
    }).then((users) => {
        res.send(users)
    }).catch((err) => {
        res.status(500).send("Failed to fetch users: " + err)
    })

})

// Get a user. id - can be any name.
app.get('/users/:id', (req, res) => {
    // access all request params.
    console.log(req.params)

    // Mongoose converts the string ids to object ids and 
    // we do not need to do that conversion.
    const _id = req.params.id

    // fetch all users.
    User.findById(_id).then((user) => {
        if(!user) {
            return res.status(404).send("User not found")
        }

        // Got a user.
        res.send(user)

    }).catch((err) => {
        res.status(500).send("Error: " +err + ".  Details:Failed to fetch user with id: " + _id)
    })

})



app.listen(port, () =>{
    console.log('Server started at port: ' + port);
})
