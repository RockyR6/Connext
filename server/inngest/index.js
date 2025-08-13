import { Inngest } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import sendEmail from "../config/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "my-app" });

// ========== CREATE ==========
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    console.log(
      "Incoming Clerk CREATE Event:",
      JSON.stringify(event.data, null, 2)
    );

    const { id, first_name, last_name, image_url } = event.data || {};
    const emailArr = event.data?.email_addresses || [];
    const email = emailArr.length > 0 ? emailArr[0]?.email_address : null;

    if (!id || !email) {
      console.error("Missing required fields for user creation:", {
        id,
        email,
      });
      return;
    }

    let username = email.split("@")[0];
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      username = username + Math.floor(Math.random() * 10000);
    }

    const userData = {
      _id: id,
      email,
      full_name: `${first_name || ""} ${last_name || ""}`.trim(),
      profile_picture: image_url || "",
      username,
    };

    try {
      await User.create(userData);
      console.log("User created in DB:", userData);
    } catch (err) {
      console.error("Error creating user in DB:", err.message);
    }
  }
);

// ========== UPDATE ==========
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    console.log(
      "Incoming Clerk UPDATE Event:",
      JSON.stringify(event.data, null, 2)
    );

    const { id, first_name, last_name, image_url } = event.data || {};
    const emailArr = event.data?.email_addresses || [];
    const email = emailArr.length > 0 ? emailArr[0]?.email_address : null;

    if (!id) {
      console.error("Missing user ID for update:", event.data);
      return;
    }

    const updatedUserData = {
      ...(email && { email }),
      full_name: `${first_name || ""} ${last_name || ""}`.trim(),
      profile_picture: image_url || "",
    };

    try {
      await User.findByIdAndUpdate(id, updatedUserData);
      console.log("User updated in DB:", updatedUserData);
    } catch (err) {
      console.error("Error updating user in DB:", err.message);
    }
  }
);

// ========== DELETE ==========
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" }, // ensure correct event name
  async ({ event }) => {
    console.log(
      "Incoming Clerk DELETE Event:",
      JSON.stringify(event.data, null, 2)
    );

    const { id } = event.data || {};
    if (!id) {
      console.error("Missing user ID for deletion:", event.data);
      return;
    }

    try {
      await User.findByIdAndDelete(id);
      console.log("User deleted from DB:", id);
    } catch (err) {
      console.error("Error deleting user in DB:", err.message);
    }
  }
);

//inngest function to send reminder when a new connection request is added
const sendNewConnectionRequestReminder = inngest.createFunction(
  { id: "send-new-connection-request-reminder" },
  { event: "app/connection-reequsest" },
  async ({ event, step }) => {
    const { connectionId } = event.data;

    await step.run("send-connection-request-mail", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id"
      );
      const subject = "New Connection Request";
      const body = `<div style="font-family: Arial, sans-serif; padding: 20px">
                    <h2>Hi ${connection.to_user_id.full_name},</h2>
                    <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
                    <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color: #10b981;">here</a> to accept or reject the request</p>
                    <br />
                    <p>Thanks, <br /> Connext - Stay Connected</p>
                    </div>`;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
      });
    });

    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await step.sleepUntil("wait-for-24-hours", in24Hours)
    await step.run('send-connection-request-reminder', async () => {
        const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id')

        if (connection.status === "accepted") {
            return {message: "Already accepted"}
        }
        const subject = "New Connection Request";
      const body = `<div style="font-family: Arial, sans-serif; padding: 20px">
                    <h2>Hi ${connection.to_user_id.full_name},</h2>
                    <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
                    <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color: #10b981;">here</a> to accept or reject the request</p>
                    <br />
                    <p>Thanks, <br /> Connext - Stay Connected</p>
                    </div>`;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
      });
      return {message: "Reminder sent."}
    })
  }
);

// Export all functions
export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion, sendNewConnectionRequestReminder];
