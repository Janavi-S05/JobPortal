const { Webhook } = require("svix");
const User = require("../models/User.js");

const clerkWebhooks = async(req,res) => {

    console.log("✅ Webhook hit!");
    console.log("Headers:", req.headers);
    console.log("Body (raw):", req.body);
    try{
        const payload = JSON.stringify(req.body);
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        console.log("Received headers:", headers);
        console.log("Received payload:", req.body);

        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        whook.verify(payload, headers); // Verifies signature

        const { data, type } = req.body;

        console.log("Webhook event type:", type);

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id:data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name+" "+data.last_name,
                    image: data.image_url,
                    resume: ''
                }
                await User.create(userData);
                console.log("User created:", userData);
                res.json({})
                break;
            }
            
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name+" "+data.last_name,
                    image: data.image_url,
                }
                await User.findByIdAndUpdate(data.id,userData)
                res.json({})
                break;
            }   

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }

            default: 
                console.log("Unhandled webhook type:", type);
                res.status(204).end();
                break;
            
        }
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:'Webhooks Error'})
    }
}
module.exports = clerkWebhooks;
