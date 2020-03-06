/** @format */

import * as express from "express";
import { Request, Response } from "express";
import User from "Models/User";
import { UserModel } from "../DataAccess/Models/UserModel";
import { ControllerBase } from "./ControllerBase";

class UserController extends ControllerBase {
  public Path = "/users";
  public Router = express.Router();

  constructor() {
    super();
    this.InitializeRoutes();
  }

  //Setup routes
  public InitializeRoutes() {
    this.Router.get(`${this.Path}/:id`, this.GetUserById)
      .post(this.Path, this.AddUser)
      .post(`${this.Path}/login`, this.LoginUser)
      .post(`${this.Path}/exists/email`, this.EmailExists);
  }

  GetUserById = async (request: Request, response: Response) => {
    const id = request.params.id;
    let user = await UserModel.findById(id);
    if (user) {
      response.OK().send(user);
    } else {
      response.NotFound().send();
    }
  };

  AddUser = async (req: Request, res: Response) => {
    const userData: User = req.body;
    const newUser = new UserModel(userData);
    let savedUser = await newUser.save();
    res.OK().send(savedUser);
  };

  LoginUser = (req: Request, res: Response) => {
    const userData: User = req.body;

    res.NotFound().send("cool cool");
  };

  EmailExists = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const userData: User = {
      Email: email
    };
    let exists = await this.CheckUserExists(userData)
    res.OK().send(exists);
  };

  private async CheckUserExists(user: User) {
    let dbUser = await UserModel.find(user);
    return dbUser && dbUser.length > 0;
  }
}

export default UserController;
