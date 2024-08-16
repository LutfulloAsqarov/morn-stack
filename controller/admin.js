import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admins, validateAdmin } from "../models/adminSchema.js";

class AdminsController {
    async get(req, res) {
        try {
            const admins = await Admins.find();

            if (!admins) {
                return res.status(400).json({
                    msg: "Admin is not defined",
                    variant: "error",
                    payload: null,
                });
            }
            res.status(200).json({
                msg: "All Admins",
                variant: "success",
                payload: admins,
            });
        } catch {
            res.status(500).json({
                msg: "Server error",
                variant: "error",
                payload: null,
            });
        }
    }

    async getProfile(req, res) {
        try {
            let admin = await Admins.findById(req.admin._id);
            res.status(200).json({
                msg: "admin registered successfully",
                variant: "success",
                payload: admin,
            });
        } catch {
            res.status(500).json({
                msg: err.message,
                variant: "error",
                payload: null,
            });
        }
    }

    async updateProfile(req, res) {
        try {
            const id = req.admin._id;
            const { username } = req.body;

            const admin = await Admins.findById(id);
            if (!admin) {
                return res.status(404).json({
                    msg: "Foydalanuvchi topilmadi",
                    variant: "error",
                    payload: null,
                });
            }

            const checkUsername = await Admins.findOne({ username });
            if (checkUsername && checkUsername._id.toString() !== id) {
                return res.status(400).json({
                    msg: "Bu username mavjud",
                    variant: "warning",
                    payload: null,
                });
            }

            const updateAdmin = await Admins.findByIdAndUpdate(
                id,
                { ...req.body, password: admin.password },
                { new: true }
            );

            return res.status(200).json({
                msg: "Profil yangilandi",
                variant: "success",
                payload: updateAdmin,
            });
        } catch (error) {
            return res.status(500).json({
                msg: "Server xatosi",
                variant: "error",
                payload: null,
            });
        }
    }

    async getAdmin(req, res) {
        try {
            const { id } = req.params;
            let admin = await Admins.findById(id);
            res.status(200).json({
                msg: "admin registered successfully",
                variant: "success",
                payload: admin,
            });
        } catch {
            res.status(500).json({
                msg: err.message,
                variant: "error",
                payload: null,
            });
        }
    }

    async registerAdmin(req, res) {
        try {
            const { error } = validateAdmin(req.body);
            if (error)
                return res.status(400).json({
                    msg: error.details[0].message,
                    variant: "error",
                    payload: null,
                });

            const { username, password } = req.body;

            const existingAdmin = await Admins.findOne({ username });

            if (existingAdmin)
                return res.status(400).json({
                    msg: "Admin already exists.",
                    variant: "error",
                    payload: null,
                });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const admin = await Admins.create({
                ...req.body,
                password: hashedPassword,
            });

            res.status(201).json({
                msg: "Admin registered successfully",
                variant: "success",
                payload: admin,
            });
        } catch (err) {
            res.status(500).json({
                msg: err.message,
                variant: "error",
                payload: null,
            });
        }
    }

    async loginAdmin(req, res) {
        const { username, password } = req.body;

        const admin = await Admins.findOne({ username });
        if (!admin)
            return res.status(400).json({
                msg: "Invalid username or password.",
                variant: "error",
                payload: null,
            });

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword)
            return res.status(400).json({
                msg: "Invalid username or password.",
                variant: "error",
                payload: null,
            });

        const token = jwt.sign(
            { _id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );

        res.status(200).json({
            msg: "Logged in successfully",
            variant: "success",
            payload: { token, admin: admin },
        });
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await Admins.findByIdAndDelete(id);
            res.status(201).json({
                msg: "Admin is deleted",
                variant: "success",
                payload: null,
            });
        } catch {
            res.status(500).json({
                msg: "server error",
                variant: "error",
                payload: null,
            });
        }
    }

    async updateAdmin(req, res) {
        try {
            const { id } = req.params;

            // Part 1

            // const { error } = validateAdmin(req.body);
            // if (error) {
            //     return res.status(400).json({
            //         msg: error.details[0].message,
            //         variant: "error",
            //         payload: null,
            //     });
            // }

            const existingAdmin = await Admins.findOne({
                username: req.body.username,
            });
            if (existingAdmin && id !== existingAdmin._id?.toString()) {
                return res.status(400).json({
                    msg: "Admin already exists.",
                    variant: "error",
                    payload: null,
                });
            }

            if (existingAdmin) {
                req.body.password = existingAdmin.password;
            }

            let admin = await Admins.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            res.status(200).json({
                msg: "Admin updated",
                variant: "success",
                payload: admin,
            });
        } catch (err) {
            res.status(500).json({
                msg: err.message,
                variant: "error",
                payload: null,
            });
        }
    }
}

export default new AdminsController();

// export default new AdminController();
