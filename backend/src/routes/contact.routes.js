import { Router } from "express";
import {
  getAll,
  create,
  update,
  remove,
  toggleFavorite,
  getOne,
} from "../controllers/contact.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", getAll);
router.get("/get/:id", getOne);
router.post("/", create);
router.put("/update/:id", update);
router.put("/update-favorite/:id", toggleFavorite);
router.delete("/delete/:id", remove);

export default router;
