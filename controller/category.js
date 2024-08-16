import { Categories, validateCategory } from "../models/categorySchema.js";

class CategoryController {
    async get(req, res) {
        try {
            let categories = await Categories.find()
                .populate([{ path: "adminId", select: ["fname", "username"] }])
                .sort({ createdAt: -1 });
            res.status(200).json({
                msg: "All categories",
                variant: "success",
                payload: categories,
            });
        } catch {
            res.status(500).json({
                msg: err.message,
                variant: "error",
                payload: null,
            });
        }
    }
    async create(req, res) {
        try {
            const { error } = validateCategory(req.body);

            if (error) {
                return res.status(400).json({
                    msg: error.details[0].message,
                    variant: "warning",
                    payload: null,
                });
            }

            let category = await Categories.create({
                ...req.body,
                adminId: req.admin._id,
            });

            res.status(201).json({
                msg: "Category is created",
                variant: "success",
                payload: category,
            });
        } catch {
            res.status(500).json({
                msg: "Server error",
                variant: "error",
                payload: null,
            });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            await Categories.findByIdAndDelete(id, req.body);
            res.status(200).json({
                msg: "Delete category",
                variant: "success",
                payload: null,
            });
        } catch {
            res.status(500).json({
                msg: "Server error",
                variant: "error",
                payload: null,
            });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            let category = await Categories.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            res.status(200).json({
                msg: "Category Updated",
                variant: "success",
                payload: category,
            });
        } catch (err) {
            res.status(500).json({
                msg: "Error",
                variant: "error",
                payload: null,
            });
        }
    }
}

export default new CategoryController();
