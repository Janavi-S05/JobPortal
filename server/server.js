/* eslint-disable @typescript-eslint/no-var-requires */
const sentry=require('./config/instrument.js')
const express= require('express')
const cors= require('cors')
const env=require('dotenv/config')
const connectDB = require('./config/db.js')
const Sentry = require("@sentry/node");
const clerkWebhooks = require('./controllers/webhooks.js')
const User = require('./models/User.js');

const app=express()

connectDB()

//Middlewares
app.use(cors());

// 👇 Add raw body parser for Clerk webhooks
app.use('/webhooks', express.raw({ type: 'application/json' }));

// 👇 All other routes can use json body parser
app.use(express.json());

//Routes
app.get('/',(req,res)=>{
    res.send('API');
})

app.get('/debug-sentry',function mainHandler(req,res){
    throw new Error("First Sentry Error");
});

app.post('/webhooks',clerkWebhooks);

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});


// Port
const PORT = process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, ()=>{
    console.log(`Server is runnning on port ${PORT}`);
})