import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize';
import xssClean from 'xss-clean';
import helmet from 'helmet'

import 'dotenv/config';

//routes
import authRoute from '../route/auth'

const app = express();

//security middleware:setting http headers
app.use(helmet());

//database connection
mongoose.connect(process.env.DATABASE_CLOUD,{
    useCreateIndex:true,
    useNewUrlParser: true,
    useFindAndModify:false,
    useUnifiedTopology: true 
}).then(()=>{
    console.log('Successfully connected to the database')
}).catch(err=>{
    console.log('connection not succesful')
})

app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


//data sanitization against noSQL query injection
app.use(mongoSanitize());
//data sanitization against XSS
app.use(xssClean());
//prevent parameter pollution

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


app.use('/api/auth',authRoute)
// app.use('/api/favorite',)
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log('server started successufully')
})