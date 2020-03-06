/** @format */

import * as express from "express";
import { Request, Response } from "express";
import User from "Models/User";
import { UserModel } from "../DataAccess/Models/UserModel";
import { ControllerBase } from "./ControllerBase";

class UserController extends ControllerBase {
  public path = "/users";
  public router = express.Router();

  constructor() {
    super();
    this.InitializeRoutes();
  }

  //Setup routes
  public InitializeRoutes() {
    this.router.get(this.path, this.GetUsers);
    this.router.get(`${this.path}/:id`, this.GetUserById);
    this.router.post(this.path, this.AddUser);
    this.router.post(`${this.path}/login`, this.LoginUser);
    this.router.post(`${this.path}/exists/email`, this.EmailExists);
  }

  GetUsers = (req: Request, res: Response) => {
    UserModel.find().then(users => res.OK().send(users));
  };

  GetUserById = (request: Request, response: Response) => {
    const id = request.params.id;
    UserModel.findById(id).then(user => {
      response.OK().send(user);
    });
  };

  AddUser = (req: Request, res: Response) => {
    const userData: User = req.body;
    const newUser = new UserModel(userData);
    newUser.save().then(savedUser => res.OK().send(savedUser));
  };

  LoginUser = (req: Request, res: Response) => {
    const userData: User = req.body;

    res.NotFound().send("cool cool");
  };

  EmailExists = (req: Request, res: Response) => {
    console.log(req.body);
    const email: string = req.body.email;
    console.log(`Email Exists: ${email}`);
    const userData: User = {
      Email: email
	};
    this.CheckUserExists(userData).then(exists => {
      res.OK().send(exists);
    });
  };

  private async CheckUserExists(user: User) {
    let dbUser = await UserModel.find(user);
    return dbUser && dbUser.length>0;
  }
}

export default UserController;
