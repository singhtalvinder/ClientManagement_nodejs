const mongoose = require('mongoose')

// For authentication
const jwt = require('jsonwebtoken')

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
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// Solution 1: .
// Return only the needed data back to the client on 
// successful authentication(Signup/ Login).
userSchema.methods.getPublicProfile = function () {
    const user = this
    const userObject = user.toObject()

    // delete the user password and the tokens array from the response
    // as these should not be returned.
    delete userObject.password
    delete userObject.tokens

    // return the modified object.
    return userObject
}

// Solution 2: 
// Return only the needed data back to the client on 
// successful authentication(Signup/ Login).
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    // delete the user password and the tokens array from the response
    // as these should not be returned.
    delete userObject.password
    delete userObject.tokens

    // return the modified object.
    return userObject
}

// Generate and authenticate users for signup and login.
userSchema.methods.generateAuthToken = async function () {
    const user = this

    // Generate and authenticate the user.
    const token = jwt.sign({ _id: user._id.toString() }, 'singhandkaur')

    // Add generated token to the db.
    // As this will help in managing users who login from multiple devices
    // and can just loggoff from one, while being logged in on others.
    user.tokens = user.tokens.concat({ token })
    // used shorthand syntax above:
    // user.tokens = user.tokens.concat({ token:token })

    // save it to the db.
    await user.save()

    // return the token.
    return token
}

// Access it directly on the model by using statics.
userSchema.statics.findByCredentials = async (email, password) => {
    // Find user by email. validate password.

    const user = await User.findOne({email: email})
    if (!user) {
        throw new Error(' Unable to Login[User not foud].')
    }

    // User found. Match passwords.
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login.')
    }

    // Found the pair.
    return user

}
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