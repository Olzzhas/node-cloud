const {body} = require('express-validator')

const registerValidation = [
    body('email', "Uncorrected email").isEmail(),
    body('password', "Password must be longer than 3 characters and less than 32").isLength({max:32, min:3})
]

module.exports = registerValidation;