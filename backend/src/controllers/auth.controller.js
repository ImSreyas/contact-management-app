import {
  registerService,
  loginService,
  refreshTokenService,
} from "../services/auth.service.js";
import { sendError, sendSuccess } from "../utils.js";

export const register = async (req, res) => {
  try {
    const user = await registerService(req.body);
    return sendSuccess(res, { user }, "User registered successfully", 201);
  } catch (error) {
    return sendError(res, error, "User registration failed", 400);
  }
};

export const login = async (req, res) => {
  try {
    const tokens = await loginService(req.body.email, req.body.password);

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 5 * 1000,
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      { user: tokens.user },
      "User logged in successfully",
      200
    );
  } catch (err) {
    return sendError(res, err, "User login failed", 400);
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return sendError(
        res,
        { message: "Refresh token missing" },
        "Refresh token missing",
        400
      );
    }

    const tokens = await refreshTokenService(refreshToken);

    // Set new tokens in HTTP-only cookies
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 5 * 1000,
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      { user: tokens.user },
      "Token refreshed successfully",
      200
    );
  } catch (err) {
    return sendError(res, err, "Token refresh failed", 400);
  }
};
