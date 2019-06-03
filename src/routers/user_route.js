const express = require('express')
const User = require('../models/user')

// Use Router for endpoints.
const router = new express.Router()

// Create new user.
// Async functions return a promise, so handle these gracefully.
router.post('/users', async (req, res) => {
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
router.get('/users', async (req, res) => {
    try {
        const user = await User.find({})
        res.send(user)

    }catch(err) {
        res.status(500).send("Failed to fetch users: " + err)
    }

})

// Get a user by name.
router.get('/users/:name', async (req, res) => {
    // access all request params.
    console.log('Params = ' + req.params)
    console.log(' Params name = ' +req.params.name)

    // Mongoose converts the string ids to object ids and 
    // we do not need to do that conversion.
    const findName = req.params.name

    try {
        // fetch a user.
        const user = await User.findOne({name: findName })
        if(!user) {
            return res.status(404).send("User not found")
        }

        // Got a user.
        res.send(user)
    } catch(err) {
        res.status(500).send("Error: " +err + ".  Details:Failed to fetch user with name: " + findName)
    }

})

// Get a user. id - can be any name.
router.get('/users/:id', async (req, res) => {
    // Access all request params.
    console.log(req.params)

    // Mongoose converts the string ids to object ids and 
    // we do not need to do that conversion.
    const _id = req.params.id

    try {
        // Fetch user by id.
        const user = await User.findById(_id)
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
router.delete('/users/:name', async (req, res) => {
    // access all request params.
    console.log('Params = ' + req.params)
    console.log(' Params name = ' +req.params.name)

    // Mongoose converts the string ids to object ids and 
    // we do not need to do that conversion.
    const findName = req.params.name

    try {
        // fetch all users.
        const user = await User.findOneAndDelete( {"name": findName} )
        if(!user) {
            return res.status(404).send("User not found")
        }

        // Got a user.
        res.send(user)
    } catch(err) {
        res.status(500).send("Error: " +err + ".  Details:Failed to delete user with name: " + findName)
    }
})

// Update a user by name.
router.patch('/users/:name', async (req, res) => {
    
    // access all request params.
    console.log('Params = ' + req.params)
    console.log('Params name = ' +req.params.name)

    // get fields to be updated and find it these are valid fields. 
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send('Error: Invalid criteria specified for updates.')
    }

    // Mongoose converts the string ids to object ids and 
    // we do not need to do that conversion.
    const findName = req.params.name

    try {
        // fetch all users.
        const user = await User.findOneAndUpdate({name: findName}, 
                                                req.body, // update with.
                                                {
                                                    new : true,  // return the new updated user.
                                                    runValidators: true // run validators while updating the user.
                                                })
        if(!user) {
            return res.status(404).send("User not found.")
        }

        // Got a user and updates applied.
        res.send(user)
    } catch(err) {
        res.status(400).send("Error: " +err + ".  Details:Failed to delete user with name: " + findName)
    }
})

// Export the router.
module.exports = router