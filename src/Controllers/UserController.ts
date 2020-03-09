/** @format */

import * as express from "express";
import "reflect-metadata";
import { Request, Response } from "express";
import User from "Models/User";
import { UserModel } from "../DataAccess/Models/UserModel";

import { INJECTABLES } from "../IOCContainer";
import { inject, injectable, multiInject } from "inversify";
import { IUserRepository } from "../DataAccess/Repositories/UserRepository";
import {
	interfaces,
	controller,
	httpGet,
	httpPost,
	httpDelete,
	request,
	queryParam,
	response,
	requestParam,
	requestBody,
	BaseHttpController
} from "inversify-express-utils";
@controller("/users")
class UserController extends BaseHttpController {
	@inject(INJECTABLES.UserRepository) private _userRepository: IUserRepository;

	constructor() {
		super();
	}

	public async GetUserById() {
		const id = this.httpContext.request.params.id;

		let user = await UserModel.findById(id);
		GetStatusMethod(this.httpContext.response)().send(user);

		function GetStatusMethod(response: express.Response): () => express.Response {
			let statusMethod;
			if (user) {
				statusMethod = response.OK;
			} else {
				statusMethod = response.NotFound;
			}
			return statusMethod;
		}
	}

	@httpPost("/Add")
	public async AddUser() {
		const userData: User = this.httpContext.request.body;
		let savedUser = await this._userRepository.AddNew(userData);
		this.httpContext.response.OK().send(savedUser);
	}

	@httpPost("/exists/email")
	public async EmailExists() {
		console.log(this._userRepository);
		let email = this.httpContext.request.body.email;
		const userData: User = {
			Email: email
		};
		let exists = await this._userRepository.CheckUserExists(userData);
		this.httpContext.response.OK().send(exists);
	}
}

export default UserController;
