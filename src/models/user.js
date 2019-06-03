const mongoose = require('mongoose')

// Bcrypt for hashing.
const bcrypt = require('bcryptjs')

// Use validator for validations instead of defining own validation rules.
const validator = require('validator')

// Define schema.
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('email is invalid.')
            }
        } 
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password" ')
            }
        }
    },
    age: {
        type: Number,
        default: 5,
        validate(value) {
            if(value < 1) {
                throw new Error('Age must be atleast 1.')
            }
        }
    }
})

// Use predefined middleware methods to handle some operations in our code.
// Note: the second parameter should be a regular function and should not be 
// an arrow function because 'this' binding is crucial and arrow functions don't 
// bind 'this'.
userSchema.pre('save', async function(next) {
    //Individual user to be saved.
    const user = this

    // execute it before a user is saved. call next when done.
    console.log('Just before saving.')

    // Hash the pwd.
    // Check if not already hashed. Will return true on a new user and also on 
    // updating a user if the password is changed.
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    // Done.
    next()

})

// The user data model. 
// Pass the userSchema to take advantage of mongoose middleware.
const User = mongoose.model('User',  userSchema)

// export it to use it.
module.exports = User