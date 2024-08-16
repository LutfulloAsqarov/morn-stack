import express from "express";
// import AdminController from "../controller/admin.js";
import AdminsController from "../controller/admin.js";
import category from "../controller/category.js";
import { auth } from "../middleware/auth.js";
import product from "../controller/product.js";

const router = express.Router();

router.get("/api/admins", AdminsController.get);
router.post("/api/admins/sign-up", AdminsController.registerAdmin);
router.post("/api/admins/sign-in", AdminsController.loginAdmin);
router.get("/api/profile", [auth], AdminsController.getProfile);
router.delete("/api/delete/admins/:id", AdminsController.delete);
router.patch("/api/update/admins/:id", AdminsController.updateAdmin);
router.get("/api/admins/:id", AdminsController.getAdmin);
router.patch("/api/update/profile", [auth], AdminsController.updateProfile);

router.get("/api/categories", category.get);
router.post("/api/categories", [auth], category.create);
router.delete("/api/categories/:id", category.delete);
router.patch("/api/categories/:id", category.update);

router.get("/api/products", [auth], product.get);
router.post("/api/products", [auth], product.create);

export default router;
