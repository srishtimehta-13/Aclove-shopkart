import mongoose from "mongoose";
import Customer from "./customer.model.js";

// Ensure 'User' is registered in Mongoose for schemas that use ref: 'User'
export const User = mongoose.models.User || mongoose.model("User", Customer.schema);
export default User;
