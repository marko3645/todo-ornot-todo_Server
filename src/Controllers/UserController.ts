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
    return dbUser && dbUser.length > 0;
  }
}

export default UserController;
