const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

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

        // generate token.
        const token = await user.generateAuthToken()

        // next line of code is executed only if the above promise is 
        // fullfilled. It will not execute if its rejected.

        // return user info with the generated token.
        res.status(201).send( {user, token} )
    } catch(err) {
        res.status(400).send("An error occured while adding user: " + err)
    }
})

// Login existing user.
router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        // Generate token for the user logging in.
        const token = await user.generateAuthToken()

        // Send limited user info back on login.
        // Solution: 1.
        res.send({user: user.getPublicProfile(), token})

        // Solution: 2.
        res.send({user, token})

    } catch(err) {
        res.status(400).send('Error: ' + err)

    }
})

/////////////////////////////////////////////////////////////////
// Every single call to the rest api will require authentication 
// except signup(create) and login.
/////////////////////////////////////////////////////////////////


// Logout user.
router.post('/users/logout', auth, async(req, res) =>{
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()

    } catch(err) {
        res.status(500).send()
    }
})

// Logout out of all sessions.
router.post('/users/logoutAll', auth, async(req, res) =>{
    try {
        req.user.tokens = []

        await req.user.save()
        res.send()

    } catch(err) {
        res.status(500).send()
    }
})

// Get current authenticated user(Or get my profile.). 
// Get all users doesn't makes sense here as a user should not be 
// able to access all other users.
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    
    // try {
    //     const users = await User.find({})
    //     res.send(users)

    // }catch(err) {
    //     res.status(500).send("Failed to fetch users: " + err)
    // }

})

// Delete existing logged-in user.
router.delete('/users/me', auth, async (req, res) => {
    try {
        // Find user and delete.
        await req.user.remove()
        // No need to check for user exists or not, as we get a user after authentication.

        // Return the logged-in user, who needs to be deleted from the system.
        res.send(req.user)
    } catch(err) {
        res.status(500).send("Error: " +err)
    }
})

// Update details of the logged-in user.
router.patch('/users/me', auth, async (req, res) => {

    // Get fields to be updated and find it these are valid fields. 
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send('Error: Invalid criteria specified for updates.')
    }

    try {
        // Shorthand.
        updates.forEach((updateWhat) => req.user[updateWhat] = req.body[updateWhat])

        await req.user.save()
        // No need to check for user exists or not, as we get a user after authentication.

        // Got a user and updates applied.
        res.send(req.user)
    } catch(err) {
        res.status(400).send("Error: " + err)
    }
})

// Export the router.
module.exports = router


// Delete a user. Should be there in its only an admin.
// router.delete('/users/:name', async (req, res) => {
//     // access all request params.
//     console.log('Params = ' + req.params)
//     console.log(' Params name = ' +req.params.name)

//     // Mongoose converts the string ids to object ids and 
//     // we do not need to do that conversion.
//     const findName = req.params.name

//     try {
//         // fetch all users.
//         const user = await User.findOneAndDelete( {"name": findName} )
//         if(!user) {
//             return res.status(404).send("User not found")
//         }

//         // Got a user.
//         res.send(user)
//     } catch(err) {
//         res.status(500).send("Error: " +err + ".  Details:Failed to delete user with name: " + findName)
//     }
// })


// // Get a user. id - can be any name.
// router.get('/users/:id', async (req, res) => {
//     // Access all request params.
//     console.log(req.params)

//     // Mongoose converts the string ids to object ids and 
//     // we do not need to do that conversion.
//     const _id = req.params.id

//     try {
//         // Fetch user by id.
//         const user = await User.findById(_id)
//         if(!user) {
//             return res.status(404).send("User not found")
//         }

//         // Got a user.
//         res.send(user)

//     } catch(err)  {
//          res.status(500).send("Error: " +err + ".  Details:Failed to fetch user with id: " + _id)
//     }

// })

//  NOT needed as a logged in user should not be able to access 
// other users information.
// Get a user by name.
// router.get('/users/:name', async (req, res) => {
//     // access all request params.
//     console.log('Params = ' + req.params)
//     console.log(' Params name = ' +req.params.name)

//     // Mongoose converts the string ids to object ids and 
//     // we do not need to do that conversion.
//     const findName = req.params.name

//     try {
//         // fetch a user.
//         const user = await User.findOne({name: findName })
//         if(!user) {
//             return res.status(404).send("User not found")
//         }

//         // Got a user.
//         res.send(user)
//     } catch(err) {
//         res.status(500).send("Error: " +err + ".  Details:Failed to fetch user with name: " + findName)
//     }

// })
// // Delete the Logged-in user. YOu cannot delete other users!
// router.delete('/users/:name', async (req, res) => {
//     // access all request params.
//     console.log('Params = ' + req.params)
//     console.log(' Params name = ' +req.params.name)

//     // Mongoose converts the string ids to object ids and 
//     // we do not need to do that conversion.
//     const findName = req.params.name

//     try {
//         // fetch all users.
//         const user = await User.findOneAndDelete( {"name": findName} )
//         if(!user) {
//             return res.status(404).send("User not found")
//         }

//         // Got a user.
//         res.send(user)
//     } catch(err) {
//         res.status(500).send("Error: " +err + ".  Details:Failed to delete user with name: " + findName)
//     }
// })

// // Update a user by name.
// router.patch('/users/:name', async (req, res) => {
    
//     // access all request params.
//     console.log('Params = ' + req.params)
//     console.log('Params name = ' +req.params.name)

//     // get fields to be updated and find it these are valid fields. 
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'age', 'email', 'password']

//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if(!isValidOperation) {
//         return res.status(400).send('Error: Invalid criteria specified for updates.')
//     }

//     // Mongoose converts the string ids to object ids and 
//     // we do not need to do that conversion.
//     const findName = req.params.name

//     try {
//         // fetch all users.
//         // NOTE: findOneAndUpdate bypasses mongoose and thus would not invoke 'pre' middleware method.
//         // So we split it into 2-ops as below.
     
//         // const user = await User.findOneAndUpdate({name: findName}, 
//         //                                         req.body, // update with.
//         //                                         {
//         //                                             new : true,  // return the new updated user.
//         //                                             runValidators: true // run validators while updating the user.
//         //                                         })

//         const user = await User.findOne({name: findName})
//         // updates.forEach((updateWhat) => {
//         //     user[updateWhat] = req.body[updateWhat]         
//         // })
//         // Shorthand.
//         updates.forEach((updateWhat) => user[updateWhat] = req.body[updateWhat])

//         await user.save()

//         if(!user) {
//             return res.status(404).send("User not found.")
//         }

//         // Got a user and updates applied.
//         res.send(user)
//     } catch(err) {
//         res.status(400).send("Error: " +err + ".  Details:Failed to delete user with name: " + findName)
//     }
// })



