import { Schema, model } from "mongoose";
import Joi from "joi";

const categorySchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        adminId: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

export const Categories = model("category", categorySchema);

export const validateCategory = (body) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        adminId: Joi.string(),
    });
    return schema.validate(body);
};
