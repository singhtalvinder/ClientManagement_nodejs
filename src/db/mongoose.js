const mongoose = require('mongoose')

// Use validator for validations instead of defining own validation rules.
const validator = require('validator')

mongoose.connect('mongodb://user125:user125@ds259596.mlab.com:59596/eventsdb',
 {
    useNewUrlParser: true,
    useCreateIndex: true
 }
)


// const u1 = new User({
//     name: '    Mickael',
//     email: '123@gmail.com   ',
//     password:'passwd13234',
//     age: 3
// })

// u1.save().then(() => {
//     console.log(u1)

// }).catch((error) =>{
//     console.log('Error: ' + error)
// })
