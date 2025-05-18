import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { registerSchema } from "../schema/formSchema.js";
import { AppError } from "../utils.js";

export const registerService = async (userData) => {
  const result = registerSchema.safeParse(userData);
  if (!result.success) {
    const errors = result.error;
    throw new AppError({ code: "100", error: errors });
  }

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError({ code: "101", error: "Email Already exist" });
  }

  const hashed = await bcrypt.hash(userData.password, 10);
  const user = await User.create({ ...userData, password: hashed });
  return {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    id: user._id,
  };
};

export const loginService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError({ code: "201", error: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw new AppError({ code: "244", error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5min",
  });
  const refresh = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return {
    accessToken: token,
    refreshToken: refresh,
    user: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      id: user._id,
    },
  };
};

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError({ code: "101", error: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError({ code: "102", error: "User not found" });
    }

    // Generate new access and refresh tokens
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5min",
    });
    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        id: user._id,
      },
    };
  } catch (err) {
    throw new AppError({ code: "103", error: "Invalid refresh token" });
  }
};
