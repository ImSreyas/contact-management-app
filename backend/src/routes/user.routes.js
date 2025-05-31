import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  profile,
  resetPassword,
  update,
  updateProfilePicture,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.use(protect);

router.get("/", profile);
router.put("/", update);

router.put("/profile-picture", upload.single("image"), updateProfilePicture);
router.delete("/profile-picture", updateProfilePicture);

router.put("/reset-password", resetPassword);

export default router;
