import User from "../models/user.model.js";
import fs from "fs";
import { profileSchema, resetPasswordSchema } from "../schema/formSchema.js";
import bcrypt from "bcryptjs";
import { AppError } from "../utils.js";
import path from "path";

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password -__v -_id");
  if (!user) {
    throw new AppError({ code: "340", error: "User not found" });
  }
  return user;
};

export const updateProfile = async (userId, userData) => {
  const result = profileSchema.safeParse(userData);
  if (!result.success) {
    const errors = result.error;
    throw new AppError({ code: "100", error: errors });
  }

  const existingEmail = await User.findOne({
    _id: { $ne: userId },
    email: userData.email,
  });
  if (existingEmail) {
    throw new AppError({ code: "101", error: "Email Already exist" });
  }

  const existingPhone = await User.findOne({
    _id: { $ne: userId },
    phone: userData.phone,
  });
  if (existingPhone) {
    throw new AppError({ code: "102", error: "Phone Already exist" });
  }

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { $set: { ...userData } },
    { new: true },
  );

  if (!user) {
    throw new AppError({ code: "103", error: "User not found" });
  }

  return {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    dob: user.dob,
    gender: user.gender,
    address: user.address,
  };
};

export const updateProfilePictureService = async (userId, profilePicPath) => {
  const oldUser = await User.findById(userId, { profilePicture: 1 });
  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        profilePicture: profilePicPath ? "/" + profilePicPath : "",
      },
    },
    { new: true },
  );

  if (!user) {
    throw new AppError({ code: "103", error: "User not found" });
  }

  if (oldUser && oldUser.profilePicture) {
    try {
      // Removing the / in the image path in db
      const filePath = oldUser.profilePicture.slice(1);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return {
    profilePicture: user.profilePicture,
  };
};

export const resetPasswordService = async (userId, userData) => {
  const result = resetPasswordSchema.safeParse(userData);
  if (!result.success) {
    return AppError({
      code: "132",
      error: { message: "Validation error", error: result.error },
    });
  }

  const { oldPassword, newPassword, confirmPassword } = userData;

  if (newPassword !== confirmPassword) {
    return AppError({
      code: "190",
      error: "New password and confirm password don't match",
    });
  }
  const user = await User.findOne({ _id: userId }, { password: 1 });

  if (!user) {
    throw new AppError({ code: "103", error: "User not found" });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new AppError({ code: "109", error: "Invalid old password" });
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10);
  const newUser = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: { password: newHashedPassword },
    },
    {
      new: true,
    },
  );
  return {
    fullName: newUser.firstName + " " + newUser.lastName,
  };
};
