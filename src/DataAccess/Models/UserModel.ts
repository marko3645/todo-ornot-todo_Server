/** @format */

import * as mongoose from "mongoose";
import User from "Models/User";

const userSchema = new mongoose.Schema({
	Email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true
	},
	Password: {
		type: String,
		required: true
	}
});

export const UserModel = mongoose.model<User & mongoose.Document>("User", userSchema);
