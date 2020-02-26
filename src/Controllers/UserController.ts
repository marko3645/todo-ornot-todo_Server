/** @format */

import * as express from "express";
import { Request, Response } from "express";
import User from "Models/User";
import { UserModel } from "../DataAccess/Models/UserModel";

class UserController {
	public path = "/users";
	public router = express.Router();

	constructor() {
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
		UserModel.find().then((users) => res.send(users));
	};

	GetUserById = (request: Request, response: Response) => {
		const id = request.params.id;
		UserModel.findById(id).then((user) => {
			response.send(user);
		});
	};

	AddUser = (req: Request, res: Response) => {
		const userData: User = req.body;
		const newUser = new UserModel(userData);
		newUser.save().then((savedUser) => res.send(savedUser));
	};

	LoginUser = (req: Request, res: Response) => {
		const userData: User = req.body;
		res.status(404).send("cool cool");
	};

	EmailExists = (req:Request, res:Response) => {
		const email:string = req.body;
		const userData:User = {
			Email: email
		}

		UserModel.exists(userData)
		.then((exists) => {
			res.status(200).send(exists);
		});

	}
}

export default UserController;
