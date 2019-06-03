const jwt = require('jsonwebtoken')
const User = require('../models/user')


// Register new middleware to run.
const auth = async (req, res, next) => {
    console.log('auth middleware')
    
    // Validate a user. Proceed only if valid.
    try {
        // get authentication value from header.
        // And remove the starting Bearer string from it to get the 
        // exact token.
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log('Retrieved token is : ' + token)

        // Validate token.
        const decoded = jwt.verify(token, 'singhandkaur')

        console.log('Decoded : user id: ' + decoded._id)
        
        // Find the user with this id which has the given token.
        const user = await User.findOne({ _id: decoded._id, 'tokens.token':token})

        if(!user) {
            throw new Error()
        }

        // Give route handler access to the user which is fetched from the db.
        req.user = user
        
        // ensure route handler runs.
        next()
        
    } catch(err) {
        res.status(401).send({Error:'Authentication failure. Please try again.'})
    }
}

module.exports = auth



// Example for middleware
// // Register new middleware to run.
// app.use((req, res, next) => {
// Example : Do not support get requests.
//     if(req.method === 'GET') {
//         res.send('GET requests are not suported.')
//     } else {
//         next()
//     }
// })

// Register new middleware to run.
// EX: site in maintenance mode, do not run any route(i.e., donot invoke next().
// app.use((req, res, next) => {
//    res.status(503).send('The site is currently under maintenance. We will be back soon!!')
// })

// Register new middleware to run.
// app.use((req, res, next) => {
//     // Run this method between the incoming request and the actual route.
//     // Call next once done.
//     console.log('middleware output: method: ' + req.method + ", Path: " + req.path)

//     // Done.Proceed further with the route handler.
//     next()
// })