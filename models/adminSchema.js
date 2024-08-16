import { Schema, model } from "mongoose";
import Joi from "joi";
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            required: true,
        },
        lname: {
            type: String,
            required: false,
            default: "",
        },
        phone: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            required: false,
            default: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["admin", "owner"],
            default: "admin",
        },
    },
    { timestamps: true }
);

export const Admins = mongoose.model("Admin", adminSchema);

export const validateAdmin = (body) => {
    const schema = Joi.object({
        fname: Joi.string().required(),
        lname: Joi.string().allow(""),
        phone: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        isActive: Joi.boolean().allow(true),
        role: Joi.string().valid("admin", "owner").allow("admin"),
    });
    return schema.validate(body);
};
