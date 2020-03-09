/** @format */

import * as express from "express";
import "reflect-metadata"
import { Request, Response } from "express";
import User from "Models/User";
import { UserModel } from "../DataAccess/Models/UserModel";
import { ControllerBase } from "./ControllerBase";

import { INJECTABLES } from "../IOCContainer";
import { inject, injectable } from "inversify";
import { IUserRepository } from "../DataAccess/Repositories/UserRepository";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, requestBody } from "inversify-express-utils";
@controller("/users")
class UserController  {

  private _userRepository:IUserRepository;

  public constructor() {
    this.InitializeRoutes();
  }

  //Setup routes
  public InitializeRoutes() {
    // this.Router.get(`${this.Path}/:id`, this.GetUserById)
    //   .post(this.Path, this.AddUser)
      // .post(`${this.Path}/exists/email`, this.EmailExists);
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
    let savedUser = this._userRepository.AddNew(userData);
    res.OK().send(savedUser);
  };

  @httpPost("exists/email")
  public async EmailExists(
    @request() req:express.Request,
    @response() res:express.Response
  ){
    console.log(this._userRepository)
    let email = req.body.email;
    const userData: User = {
      Email: email
    };
    let exists = await this.CheckUserExists(userData);
    res.OK().send(exists);
  }

  // EmailExists = async (req: Request, res: Response) => {
  //   console.log(this._userRepository)
  //   const email: string = req.body.email;
  //   const userData: User = {
  //     Email: email
  //   };
  //   let exists = await this.CheckUserExists(userData);
  //   res.OK().send(exists);
  // };

  private async CheckUserExists(user: User) {
    let dbUser = await UserModel.find(user);
    return dbUser && dbUser.length > 0;
  }
}

export default UserController;
