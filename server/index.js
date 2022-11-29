const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const app = new express();

const authRouter = require('./routes/auth.routes')
const corsMiddleware = require('./middleware/cors.middleware')

app.use(corsMiddleware)
app.use(express.json())
app.use("/api/auth", authRouter)

const PORT = config.get('serverPort')

const start = async () => {
    try{
        await mongoose.connect(config.get('dbUrl'))
            .then(()=>{
                console.log('Database is connected...')
            })

        app.listen(PORT,(error)=>{
            if(error){
                console.log(error)
            }else{
                console.log(`Server has been started on ${PORT}...`)
            }
        })
    }catch (error){
        throw error
    }
}

start()


