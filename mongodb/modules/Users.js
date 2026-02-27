import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String, required: [true, "Last name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: { type: String, required: [true, "Password is required"] },
    imageUpload: { type: String, default: null },
    agreeTerms: { type: Boolean, required: true },
}, { timestamps: true });

const User = mongoose.model("users", userSchema);

export default User;