/* eslint-disable @typescript-eslint/no-var-requires */
const sentry=require('./config/instrument.js')
const express= require('express')
const cors= require('cors')
const env=require('dotenv/config')
const connectDB = require('./config/db.js')
const Sentry = require("@sentry/node");
const clerkWebhooks = require('./controllers/webhooks.js')

const app=express()

connectDB()

//Middlewares
app.use(cors())
app.use(express.json())

//Routes
app.get('/',(req,res)=>{
    res.send('API');
})

app.get('/debug-sentry',function mainHandler(req,res){
    throw new Error("First Sentry Error");
});

app.post('/webhooks',clerkWebhooks);

// Port
const PORT = process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, ()=>{
    console.log(`Server is runnning on port ${PORT}`);
})