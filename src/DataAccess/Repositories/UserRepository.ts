import { UserModel } from "../Models/UserModel";
import User from "Models/User";
import { HashingUtils } from "../../Utils/HashingUtils";

import { Document } from "mongoose";
import { injectable } from "inversify";

export interface IUserRepository {
  AddNew(user: User): Promise<User & Document>;
  IsPasswordValid(userId: string, clearTextPassword: string): Promise<boolean>;
  GetByEmail(email: string): Promise<User & Document>;
}

@injectable()
export class UserRepository implements IUserRepository {
  public async AddNew(user: User) {
    const newUser = new UserModel(user);
    let savedUser:(User & Document) = await newUser.save();
    return savedUser;
  }

  public async IsPasswordValid(
    userId: string,
    clearTextPassword: string
  ): Promise<boolean> {
    let dbUser: User = await UserModel.findById(userId);
    let isPasswordValid = HashingUtils.AreEqual(
      clearTextPassword,
      dbUser.Password
    );
    return isPasswordValid;
  }

  public async GetByEmail(email: string) {
    let userData: User = {
      Email: email
    };
    return await UserModel.findOne(userData);
  }
}
