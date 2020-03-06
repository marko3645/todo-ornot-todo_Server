import { expect } from "chai";
import UserController from "../../Controllers/UserController";
import { ResponseExtensions } from "../../Extensions/ResponseExtensions";
import * as express from "express";

describe("UserController", () => {
  let userController: UserController;

  before(() => {
    let response = express.response;
    new ResponseExtensions(response).Init();
  });

  beforeEach(() => {
    userController = new UserController();
  });

  describe("Constructor", () => {
    it("Should Call InitializeRoutes()", () => {
      let calledInitializeRoutes: boolean = false;

      let previousUserControllerInitializeRoutes =
        UserController.prototype.InitializeRoutes;

      UserController.prototype.InitializeRoutes = () => {
        calledInitializeRoutes = true;
      };

      new UserController();
      UserController.prototype.InitializeRoutes = previousUserControllerInitializeRoutes;
      expect(calledInitializeRoutes).to.equal(true);
    });
    it("Sets Path variable correctly", () => {
      expect(userController.Path).to.equal("/users");
    });
    it("Initializes Router", () => {
      expect(userController.Router).to.not.equal(undefined);
    });
  });
  describe("InitializeRoutes()", () => {
    let givenPaths: { path: string; method: string }[];
    before(() => {
      givenPaths = [];
      userController.Router.get = (path: any, methodToRun: any) => {
        console.log("Added Get");
        givenPaths.push({ path: path, method: "get" });
        return userController.Router;
      };

      userController.Router.post = (path: any, methodToRun: any) => {
        givenPaths.push({ path: path, method: "post" });
        return userController.Router;
      };
      userController.InitializeRoutes();
    });

    it("Adds /users/:id get path", () => {
      console.log(givenPaths);
      expect(givenPaths).to.deep.include({ path: "/users/:id", method: "get" });
    });

    it("Adds /users post path", () => {
      expect(givenPaths).to.deep.include({ path: "/users", method: "post" });
    });

    it("Adds /users/login post path", () => {
      expect(givenPaths).to.deep.include({
        path: "/users/login",
        method: "post"
      });
    });

    it("Adds /users/exists/email post path", () => {
      expect(givenPaths).to.deep.include({
        path: "/users/exists/email",
        method: "post"
      });
    });
  });
});
