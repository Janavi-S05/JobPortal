const { Webhook } = require("svix"); // library Clerk uses to verify webhook requests
const User = require("../models/User.js");

const clerkWebhooks = async (req, res) => {
    console.log("✅ Webhook hit!");
    console.log("Headers:", req.headers);
    console.log("Body (raw):", req.body);

    try {
        // Verify the webhook's signature
        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET); // secret token used to verify that the webhook is genuinely from Clerk.
        webhook.verify(JSON.stringify(req.body), req.headers); // Verifying signature and body

        const { data, type } = req.body;

        // Make sure that required data is present
        if (!data || !data.id || !data.first_name || !data.last_name || !data.email_addresses || !data.email_addresses[0].email_address || !data.image_url) {
            console.error("Missing required data:", data);
            return res.status(400).json({ success: false, message: "Incomplete data received" });
        }

        console.log("Received payload:", data);

        switch (type) {
            case 'user.created': {

                // When a new user signs up using Clerk: Create a new user in MongoDB with their Clerk id, name, email, image
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                    resume: ''
                };

                console.log("Creating new user:", userData);
                const savedUser = await User.create(userData);
                console.log("✅ User created and saved to MongoDB:", savedUser);

                res.status(201).json({ success: true, message: "User created successfully" });
                break;
            }

            case 'user.updated': {
                // When user changes profile details in Clerk, this updates the user in your MongoDB.
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                };

                console.log("Updating user:", userData);
                await User.findByIdAndUpdate(data.id, userData, { new: true });
                res.json({ success: true, message: "User updated successfully" });
                break;
            }

            case 'user.deleted': {
                // When the user account is deleted in Clerk, it deletes the user from your DB too.
                console.log("Deleting user with ID:", data.id);
                await User.findByIdAndDelete(data.id);
                res.json({ success: true, message: "User deleted successfully" });
                break;
            }

            default: {
                console.log("Unhandled webhook type:", type);
                res.status(204).end();
                break;
            }
        }
    } catch (error) {
        console.error("Error processing webhook:", error.message);
        res.status(500).json({ success: false, message: "Error processing webhook" });
    }
};

module.exports = clerkWebhooks;
