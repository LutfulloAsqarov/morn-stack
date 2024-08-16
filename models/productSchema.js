import { Schema } from "mongoose";
import Joi from "joi";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        oldPrice: {
            type: Number,
            default: 0,
        },
        stock: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "category",
        },
        adminId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Admin",
        },
        units: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        urls: {
            type: Array,
            required: true,
        },
        info: {
            type: Array,
            required: false,
            default: [],
        },
        available: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Products = mongoose.model("Product", productSchema);

export const validateProduct = (body) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required(),
        oldPrice: Joi.number().allow(0),
        stock: Joi.number().allow(0),
        rating: Joi.number().allow(0),
        views: Joi.number(),
        categoryId: Joi.string(),
        adminId: Joi.string().required(),
        units: Joi.string().required(),
        desc: Joi.string().required(),
        urls: Joi.array().required(),
        info: Joi.string(),
        available: Joi.boolean().allow(true),
    });
    return schema.validate(body);
};
