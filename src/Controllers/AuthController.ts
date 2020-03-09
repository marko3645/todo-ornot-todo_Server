import { ControllerBase } from "./ControllerBase";
import * as passport from "passport";
import { Request, Response, NextFunction } from "express";
export class AuthController {
  constructor(path: string) {

    this.InitializeRoutes();
  }

  private InitializeRoutes() {
    // this.Router.post(
    //   `${this.Path}/login`,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     passport.authenticate("local", function(err, user, info) {
    //       req.login(user, function() {
    //         console.log(err);
    //         console.log(user);
    //         console.log(info);
    //         res.OK().send(user);
    //       });
    //     })(req, res);
    //   }
    // );
  }
}
