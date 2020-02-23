/** @format */

import * as mongoose from "mongoose";
import User from "Models/User";

const userSchema = new mongoose.Schema({
	Email: String,
	Password: String
});

export const UserModel = mongoose.model<User & mongoose.Document>("User", userSchema);
