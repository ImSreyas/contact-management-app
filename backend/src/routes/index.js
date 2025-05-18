import { Router } from "express";
import authRoutes from "./auth.routes.js";
import contactRoutes from "./contact.routes.js";

const router = Router()

router.use("/auth", authRoutes);
router.use("/contacts", contactRoutes);

export default router;
