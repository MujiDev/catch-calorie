import pkg from "mongoose";

const { Schema, model } = pkg;

/**
 * @swagger
 * 
 */

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        immutable: true,
        trim: true,
    },
    password: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        enum: ["us", "non_us"],
        required: true,
        default: "us",
    },
    open: {
        type: Boolean,
        required: true,
        default: true,
    },
    icon: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: false,
        default: "No status message.",
    },
});

const UserModel = model("User", UserSchema);

export { UserModel };
