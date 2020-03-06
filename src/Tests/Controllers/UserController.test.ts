import { expect } from "chai";
import UserController from "../../Controllers/UserController";
import { ResponseExtensions } from "../../Extensions/ResponseExtensions";
import * as express from "express";
import { UserModel } from "../../DataAccess/Models/UserModel";
import { DocumentQuery } from "mongoose";
import User from "../../Models/User";
describe("UserController", () => {
  let userController: UserController;

  before(() => {
    let response = express.response;
    new ResponseExtensions(response).Init();
  });

  beforeEach(() => {
    userController = new UserController("/users");
  });

  describe("Constructor", () => {
    it("Should Call InitializeRoutes()", () => {
      let calledInitializeRoutes: boolean = false;

      let previousUserControllerInitializeRoutes =
        UserController.prototype.InitializeRoutes;

      UserController.prototype.InitializeRoutes = () => {
        calledInitializeRoutes = true;
      };

      new UserController("/users");
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
      expect(givenPaths).to.deep.include({ path: "/users/:id", method: "get" });
    });

    it("Adds /users post path", () => {
      expect(givenPaths).to.deep.include({ path: "/users", method: "post" });
    });

    it("Adds /users/exists/email post path", () => {
      expect(givenPaths).to.deep.include({
        path: "/users/exists/email",
        method: "post"
      });
    });
  });

  describe("API Methods", () => {
    let res: any = {};
    let req: any = {
      params: {
        id: "5aa06bb80738152cfd536fdc" // for testing get, delete and update vehicle
      }
    };
    beforeEach(() => {});
    let status;
    res.send = () => {};
    describe("GetUserByID ", () => {
      it("Sets status to ok when user is found", async () => {
        res.OK = () => {
          status = 200;
          return res;
        };

        UserModel.findById = id => {
          let promise = new Promise((resolve: any) => {
            resolve(true);
          });
          return (promise as unknown) as DocumentQuery<any, any, any>;
        };
        await userController.GetUserById(req, res);
        expect(status).to.equal(200);
      });
      it("Sets status to notfound when user is not found", async () => {
        res.NotFound = () => {
          status = 404;
          return res;
        };
        UserModel.findById = id => {
          let promise = new Promise((resolve: any) => {
            resolve(false);
          });
          return (promise as unknown) as DocumentQuery<any, any, any>;
        };
        await userController.GetUserById(req, res);
        expect(status).to.equal(404);
      });
    });

    describe("AddUser", () => {
      req.body = {
        Email: "marko3645@gmail.com",
        Password: "MyAwesomePassword"
      };
      UserModel.prototype.save = function() {
        let promise = new Promise<User & Document>(resolve => {
          resolve(req.body);
        });
        return (promise as unknown) as DocumentQuery<any, any, any>;
      };
      it("Sets status to OK", async () => {
        await userController.AddUser(req, res);
        expect(status).to.equal(200);
      });
      it("Returns back the new user", async () => {
        let sentValue;
        res.send = (val: any) => {
          sentValue = val;
        };
        await userController.AddUser(req, res);
        expect(sentValue).to.equal(req.body);
      });
    });
    describe("EmailExists", () => {
      req.body = {
        Email: "marko3645@gmail.com"
      };
      UserModel.find = (val: any) => {
        let promise = new Promise(resolve => {
          resolve([true]);
        });
        return (promise as unknown) as DocumentQuery<any, any, any>;
      };
      it("Sets the status to OK", async () => {
        await userController.EmailExists(req, res);
        expect(status).to.be.equal(200);
      });
      it("Returns true if the for an existing user", async () => {
        let userExists;
        res.send = (val: any) => {
          userExists = val;
        };

        await userController.EmailExists(req, res);

        expect(userExists).to.be.equal(true);
      });
    });
  });
});
