import {
  getProfile,
  resetPasswordService,
  updateProfile,
  updateProfilePictureService,
} from "../services/user.service.js";
import { sendError, sendSuccess } from "../utils.js";

export const profile = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return sendError(res, {}, "Unauthorized", 401);
  }

  try {
    const response = await getProfile(userId);
    if (response) {
      return sendSuccess(res, { user: response }, "User profile found");
    } else {
      return sendError(res, {}, "User profile not found", 404);
    }
  } catch (error) {
    return sendError(res, error, "Failed to fetch user profile", 500);
  }
};

export const update = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return sendError(res, {}, "User id not found", 401);
  }
  try {
    const user = await updateProfile(userId, req.body);
    if (user) {
      return sendSuccess(res, { user }, "Profile updated successfully", 200);
    } else {
      return sendError(res, {}, "User Profile not found", 401);
    }
  } catch (error) {
    return sendError(res, error, "Profile updation failed", 400);
  }
};

export const updateProfilePicture = async (req, res) => {
  const userId = req.user.id;
  const profilePicPath = req.file?.path;

  if (!userId) {
    return sendError(res, {}, "User id not found", 401);
  }

  if (!profilePicPath) {
    return sendError(res, {}, "No image found", 400);
  }

  try {
    const user = await updateProfilePictureService(userId, profilePicPath);
    if (user) {
      return sendSuccess(res, { user }, "Profile updated successfully", 200);
    } else {
      return sendError(res, {}, "User Profile not found", 401);
    }
  } catch (error) {
    return sendError(res, error, "Profile updation failed", 400);
  }
};

export const resetPassword = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return sendError(res, {}, "User id not found", 401);
  }

  try {
    const user = await resetPasswordService(userId, req.body);
    if (user) {
      return sendSuccess(res, { user }, "Password updated successfully", 200);
    } else {
      return sendError(res, {}, "User not found", 401);
    }
  } catch (error) {
    return sendError(res, error, "Profile updation failed", 400);
  }
};
