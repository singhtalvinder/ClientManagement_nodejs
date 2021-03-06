const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user_route')

const app = express()

const port = process.env.port || 3000;

// With middleware: 
// new request ----> (express middleware) do something (basically authenticate) ---->run route hndler.

// Automatically parse inconing json into an object that can be accessed in req handlers.
app.use(express.json())

// register the router with app.
app.use(userRouter)

// Run and listen on the port.
app.listen(port, () =>{
    console.log('Server started at port: ' + port);
})

