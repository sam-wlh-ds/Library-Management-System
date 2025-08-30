import mongoose from 'mongoose';
import UserModel from '../models/UserModel.js';

async function getUserById(id) {
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch user");
  }
}


export {getUserById};