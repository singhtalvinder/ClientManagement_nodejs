const express = require('express')
require('./db/mongoose')
const User = require('./models/user')

const app = express()

const port = process.env.port || 3000;


// Automatically parse inconing json into an object that can be accessed in req handlers.
app.use(express.json())

// Create new user.
// Async functions return a promise, so handle these gracefully.
app.post('/users', async (req, res) => {
    console.log(req.body)

    // create the new user
    const user = new User(req.body)
    try {
        await user.save()
        // next line of code is executed only if the above promise is 
        // fullfilled. It will not execute if its rejected.

        res.status(201).send(user)
    } catch(err) {
        res.status(400).send("An error occured while adding user: " + err)
    }
})

// Get all users.
app.get('/users', async (req, res) => {
    try {
        await User.find({})
        res.send(users)

    }catch(err) {
        res.status(500).send("Failed to fetch users: " + err)
    }

})

// Get a user by name.
app.get('/users/:name', async (req, res) => {
    // access all request params.
    console.log('Params = ' + req.params)
    console.log(' Params name = ' +req.params.name)

    // Mongoose converts the string ids to object ids and 
    // we do not need to do that conversion.
    const findName = req.params.name

    try {
        // fetch a user.
        await User.findOne({name: findName })
        if(!user) {
            return res.status(404).send("User not found")
        }

        // Got a user.
        res.send(user)
    } catch(err) {
        res.status(500).send("Error: " +err + ".  Details:Failed to fetch user with name: " + findName)
    }

})

// // Get a user by name and count of docs.
// app.get('/users/:name', (req, res) => {
//     // access all request params.
//     console.log('Params = ' + req.params)
//     console.log(' Params name = ' +req.params.name)

//     // Mongoose converts the string ids to object ids and 
//     // we do not need to do that conversion.
//     const findName = req.params.name

//     // fetch all users.
//     User.findOne({name: findName }).then((user) => {
//         if(!user) {
//             return res.status(404).send("User not found")
//         }

//         console.log('Found the user!! ')
//         return User.countDocuments()

//         // Got a user.
//         //res.send(user)

//     }).then((docCount) => {
//         console.log('doc count is : ' + docCount)
//         res.send(user)
//     }).catch((err) => {
//         res.status(500).send("Error: " +err + ".  Details:Failed to fetch user with name: " + findName)
//     })

// })

// Get a user. id - can be any name.
app.get('/users/:id', async (req, res) => {
    // Access all request params.
    console.log(req.params)

    // Mongoose converts the string ids to object ids and 
    // we do not need to do that conversion.
    const _id = req.params.id

    try {
        // Fetch user by id.
        await User.findById(_id)
        if(!user) {
            return res.status(404).send("User not found")
        }

        // Got a user.
        res.send(user)

    } catch(err)  {
         res.status(500).send("Error: " +err + ".  Details:Failed to fetch user with id: " + _id)
    }

})

// Delete a user by name.
app.post('/users/:name', async (req, res) => {
    // access all request params.
    console.log('Params = ' + req.params)
    console.log(' Params name = ' +req.params.name)

    // Mongoose converts the string ids to object ids and 
    // we do not need to do that conversion.
    const findName = req.params.name

    try {
        // fetch all users.
        await User.findOneAndDelete({name: findName })
        if(!user) {
            return res.status(404).send("User not found")
        }

        // Got a user.
        res.send(user)
    } catch(err) {
        res.status(500).send("Error: " +err + ".  Details:Failed to delete user with name: " + findName)
    }
})

// Run and listen on the port.
app.listen(port, () =>{
    console.log('Server started at port: ' + port);
})
