import { Router } from "express";
import { register, login, refresh } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.post("/register", upload.single("profilePicture"), register);
// router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

export default router;
