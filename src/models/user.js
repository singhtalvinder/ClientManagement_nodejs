const mongoose = require('mongoose')

// Use validator for validations instead of defining own validation rules.
const validator = require('validator')

// The user data model. 
const User = mongoose.model('User', {
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

// export it to use it.
module.exports = User