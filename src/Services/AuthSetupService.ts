/** @format */

import * as passport from "passport";
import * as LocalStrategy from "passport-local";
import { UserRepository, IUserRepository } from "../DataAccess/Repositories/UserRepository";
import { inject } from "inversify";
import { INJECTABLES } from "../IOCContainer";
import { UserModel } from "../DataAccess/Models/UserModel";
import User from "../Models/User";

export class AuthSetupService {
	@inject(INJECTABLES.UserRepository) private _userRepository: IUserRepository;
	constructor() {}
	public async Init() {
		let localStrategy = await this.BuildLocalStrategy();
		passport.use(localStrategy);
		this.implementDeserialization();
		this.ImplementSerialization();
	}

	private ImplementSerialization() {
		passport.serializeUser(function(user: User, done) {
			console.log("Serializing User");
			done(null, user._id);
			// if you use Model.id as your idAttribute maybe you'd want
			// done(null, user.id);
		});
	}

	private implementDeserialization() {
		passport.deserializeUser((id, done) => {
			console.log("Deserializing user");
			this._userRepository.findById(id, function(err, user) {
				done(err, user);
			});
		});
	}

	private async BuildLocalStrategy() {
		return new LocalStrategy.Strategy(
			{
				usernameField: "Email",
				passwordField: "Password"
			},
			async function(email, clearTextPassword, done) {
				console.log("Validating User");
				//Get user from db via email
				let userRepository = new UserRepository();
				let user = await userRepository.GetByEmail(email);
				if (user) {
					//Check password validity
					let isPasswordValid = await userRepository.IsPasswordValid(user.id, clearTextPassword);
					if (isPasswordValid) {
						return done(null, user, { message: "EHH" });
					}
				}
				return done(null, false, { message: "Incorrect user details" });
			}
		);
	}
}
