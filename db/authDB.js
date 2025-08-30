import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import UserModel from '../models/UserModel.js';

async function createUser({ username, password, email }) {
  try {
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    const newUser = new UserModel({
      username,
      password: hashedPassword,
      email,
    });

    await newUser.save();
    return { success: true, message: "User created" };
  } catch (error) {
    throw new Error(error.message || "User creation failed");
  }
}

async function verifyUser({username, password}) {
  try {
      const existingUser = await UserModel.findOne({ username });
      if (!existingUser) {
        throw new Error("Invalid Username");
      } 

      const hashedPassword = existingUser.password;
      const valid = await bcrypt.compare(password, hashedPassword);
      if (valid) return existingUser;

      throw new Error("Invalid Password");
  } catch (error) {
    throw new Error(error.message || "User verification failed");
  }
}

async function deleteUser(username) {
  try {
    const result = await UserModel.deleteOne({ username });

    if (result.deletedCount === 0) {
      throw new Error("Username not found");
    }

    return { success: true, message: "User deleted" };
  } catch (error) {
    // Rethrow clean error
    throw new Error(error.message || "Failed to delete user");
  }
}

export {createUser, verifyUser, deleteUser};