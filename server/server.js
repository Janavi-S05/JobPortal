/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv/config')
const express= require('express')
const cors= require('cors')
const connectDB = require('./config/db.js')
const Sentry = require("@sentry/node");
const clerkWebhooks = require('./controllers/webhooks.js')

const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");

const {clerkMiddleware} = require('@clerk/express')

const connectCloudinary = require("./config/cloudinary");
const app=express()

connectDB()
connectCloudinary()

//Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

// 👇 Add raw body parser for Clerk webhooks
app.use('/webhooks', express.raw({ type: 'application/json' }));

//Routes
app.get('/',(req,res)=>{
    res.send('API');
})

app.get('/debug-sentry',function mainHandler(req,res){
    throw new Error("First Sentry Error");
});

app.post('/webhooks',clerkWebhooks)
app.use('/api/company',companyRoutes)
app.use('/api/jobs',jobRoutes)
app.use('/api/users',userRoutes)

// Port
const PORT = process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, ()=>{
    console.log(`Server is runnning on port ${PORT}`);
})