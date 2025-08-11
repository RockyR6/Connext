import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "my-app" });

// ========== CREATE ==========
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        console.log("📦 Incoming Clerk CREATE Event:", JSON.stringify(event.data, null, 2));

        const { id, first_name, last_name, image_url } = event.data || {};
        const emailArr = event.data?.email_addresses || [];
        const email = emailArr.length > 0 ? emailArr[0]?.email_address : null;

        if (!id || !email) {
            console.error("❌ Missing required fields for user creation:", { id, email });
            return;
        }

        let username = email.split('@')[0];
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            username = username + Math.floor(Math.random() * 10000);
        }

        const userData = {
            _id: id,
            email,
            full_name: `${first_name || ""} ${last_name || ""}`.trim(),
            profile_picture: image_url || "",
            username
        };

        try {
            await User.create(userData);
            console.log("✅ User created in DB:", userData);
        } catch (err) {
            console.error("❌ Error creating user in DB:", err.message);
        }
    }
);

// ========== UPDATE ==========
const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        console.log("📦 Incoming Clerk UPDATE Event:", JSON.stringify(event.data, null, 2));

        const { id, first_name, last_name, image_url } = event.data || {};
        const emailArr = event.data?.email_addresses || [];
        const email = emailArr.length > 0 ? emailArr[0]?.email_address : null;

        if (!id) {
            console.error("❌ Missing user ID for update:", event.data);
            return;
        }

        const updatedUserData = {
            ...(email && { email }),
            full_name: `${first_name || ""} ${last_name || ""}`.trim(),
            profile_picture: image_url || ""
        };

        try {
            await User.findByIdAndUpdate(id, updatedUserData);
            console.log("✅ User updated in DB:", updatedUserData);
        } catch (err) {
            console.error("❌ Error updating user in DB:", err.message);
        }
    }
);

// ========== DELETE ==========
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-from-clerk' },
    { event: 'clerk/user.deleted' }, // ensure correct event name
    async ({ event }) => {
        console.log("📦 Incoming Clerk DELETE Event:", JSON.stringify(event.data, null, 2));

        const { id } = event.data || {};
        if (!id) {
            console.error("❌ Missing user ID for deletion:", event.data);
            return;
        }

        try {
            await User.findByIdAndDelete(id);
            console.log("🗑️ User deleted from DB:", id);
        } catch (err) {
            console.error("❌ Error deleting user in DB:", err.message);
        }
    }
);

// Export all functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
];
