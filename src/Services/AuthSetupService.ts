import * as passport from "passport";
import * as LocalStrategy from "passport-local";
import { UserRepository } from "../DataAccess/Repositories/UserRepository";

export class AuthSetupService {
  constructor() {}
  public async Init() {
    let localStrategy = await this.BuildLocalStrategy();
    passport.use(localStrategy);
  }

  private async BuildLocalStrategy() {
    return new LocalStrategy.Strategy(
      {
        usernameField: "Email",
        passwordField: "Password"
      }
      ,async function(
      email,
      clearTextPassword,
      done
    ) {
      //Get user from db via email
      let userRepository = new UserRepository();
      let user = await userRepository.GetByEmail(email);
      if (user) {
        //Check password validity
        let isPasswordValid = await userRepository.IsPasswordValid(
          user.id,
          clearTextPassword
        );
        if (isPasswordValid) {
          return done(null, user);
        }
      }
      return done(null, false, { message: "Incorrect user details" });
    });
  }
}
