import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import { UserModel } from '../models/index.js';

async function createUser({ name, email, password }) {
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email address");
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return { success: true, message: "User created" };
  } catch (error) {
    throw new Error(error.message || "User creation failed");
  }
}

async function verifyUser({ email, password }) {
  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      throw new Error("Invalid email or password");
    }

    const hashedPassword = existingUser.password;
    const valid = await bcrypt.compare(password, hashedPassword);
    if (valid) {
      return existingUser;
    }

    throw new Error("Invalid email or password");
  } catch (error) {
    throw new Error(error.message || "User verification failed");
  }
}

async function updatePassword({ email, oldPassword, newPassword }) {
  try {
    const user = await verifyUser({ email, password: oldPassword });
    
    const newHashedPassword = await bcrypt.hash(newPassword, 7);
    user.password = newHashedPassword;
    await user.save();

    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    throw new Error(error.message || "Failed to update password");
  }
}

async function deleteUser(email) {
  try {
    const result = await UserModel.deleteOne({ email });

    if (result.deletedCount === 0) {
      throw new Error("User not found");
    }

    return { success: true, message: "User deleted" };
  } catch (error) {
    throw new Error(error.message || "Failed to delete user");
  }
}

export { createUser, verifyUser, updatePassword, deleteUser };