const Router = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const User = require('../models/User')
const registerValidation = require('../validations/auth')
const router = new Router();

router.post('/register', registerValidation, async (req, res)=>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message: "Uncorrected request!", errors})
        }

        const {email, password} = req.body
        const candidate = await User.findOne({email})

        if(candidate){
            return res.status(400).json({message:`A user with email ${email} already exist!`})
        }
        const hashPassword = await bcrypt.hash(password, 6)
        const user = new User({email, password:hashPassword})
        await user.save()
        return res.send({message:"User was created successfully!"})
    }catch(error){
        console.log(error)
        res.send({message:"Server Error!"})
    }
})

router.post('/login', async (req,res) => {
    try{
        const {email,password} = req.body

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User not found!"})
        }

        const isPassValid = bcrypt.compareSync(password, user.password)
        if(!isPassValid){
            return res.status(400).json({message:"Invalid Password!"})
        }

        const token = jwt.sign({id: user.id}, config.get('secretKey'), {expiresIn: "1h"})

        return res.json({
            token,
            user:{
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar
            }

        })

    }catch (error) {
        console.log(error)
        res.send({message:"Server Error!"})
    }
})

module.exports = router;