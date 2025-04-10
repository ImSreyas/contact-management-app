import { registerService, loginService } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const user = await registerService(req.body);
    res.status(201).json({ status: true, data: user });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const tokens = await loginService(req.body.email, req.body.password);
    res.json({ status: true, data: tokens });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};
