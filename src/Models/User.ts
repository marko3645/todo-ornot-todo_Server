/** @format */

import * as mongoose from "mongoose";

/** @format */

interface User {
	_id?: mongoose.Types.ObjectId;
	Email?: string;
	Password?: string;
}

export default User;
