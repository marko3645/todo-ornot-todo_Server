
import {UserModel} from "../Models/UserModel";
import User from "Models/User";
import { HashingUtils } from "Utils/HashingUtils";
export class UserRepository{

    public async IsPasswordValid(userId:string, clearTextPassword:string):Promise<boolean>{
        
        let dbUser:User = await UserModel.findById(userId);
        let isPasswordValid = HashingUtils.AreEqual(clearTextPassword, dbUser.Password);
        return isPasswordValid;
    }

    public async GetByEmail(email:string){
        let userData:User = {
            Email: email
        }
        return await UserModel.findOne(userData);
    }

}