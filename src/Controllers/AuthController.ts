/** @format */
import * as passport from "passport";
import { Request, Response, NextFunction } from "express";
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
	BaseHttpController,
	next
} from "inversify-express-utils";
import { ConsoleLogUtils, ConsoleColour } from "../Utils/ConsoleLogUtils";

@controller("/auth")
export class AuthController extends BaseHttpController {
	constructor() {
		super();
	}

	@httpPost("/login")
	public async Login(@request() req, @response() res, @next() next) {
		console.log("Logging in");
		let authenticationFunction = passport.authenticate("local", function(err, user) {
			if (err) {
				return next(err);
			}
			if (!user) {
				console.log("No user here");
				return null;
			} else {
				console.log("User here");
				req.logIn(user, function(error) {
					if (error) {
						return next(error);
					}
					return next(user);
				});
			}
		});
		let response = await authenticationFunction(req, res, next);
	}

	@httpGet("/loggedIn")
	public LoggedIn() {
		console.log("Got to logged in");
	}
}
