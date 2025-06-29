/* eslint-disable @typescript-eslint/no-var-requires */
// Loads .env environment variables using dotenv/config
require('dotenv/config')
const express= require('express') // web framework for building APIs
const cors= require('cors') // middleware to handle cross origin resource sharing
const connectDB = require('./config/db.js')
const Sentry = require("@sentry/node"); // error tracking service to capture runtime errors
const clerkWebhooks = require('./controllers/webhooks.js') // handles the incoming webhooks from clerk(auth service)

// handles different API endpoints
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");

const {clerkMiddleware} = require('@clerk/express') // middleware to verify and inject user info from clerk

const connectCloudinary = require("./config/cloudinary"); // set up image uploads using cloudinary
const app=express() // Initializes express application

connectDB()
connectCloudinary()

//Middlewares
app.use(cors()); // alows requests from frontend(usually hosted elsewhere)
app.use(express.json()); // Parses incoming JSON requests
app.use(clerkMiddleware()) // auth incoming requests

// 👇 Add raw body parser for Clerk webhooks
app.use('/webhooks', express.raw({ type: 'application/json' }));

//Routes
app.get('/',(req,res)=>{
    res.send('API');
})

app.get('/debug-sentry',function mainHandler(req,res){
    throw new Error("First Sentry Error");
});

// webhook - one application to automatically send real time data to another appl when a specific event happens
// when a new user signs up using clerk, Clerk sends a HTTP POST request to your server /controller/webhook.js
app.post('/webhooks',clerkWebhooks) // Handles post requests from clerk's Webhook system
app.use('/api/company',companyRoutes)
app.use('/api/jobs',jobRoutes)
app.use('/api/users',userRoutes)

// Port
const PORT = process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, ()=>{
    console.log(`Server is runnning on port ${PORT}`);
})