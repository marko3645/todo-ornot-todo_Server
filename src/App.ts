/** @format */

import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as mongoose from "mongoose";
import * as cors from "cors";
import {
  ConsoleLogUtils,
  ConsoleColour as ConsoleTextEffect,
  ConsoleColour
} from "./Utils/ConsoleLogUtils";
import { ExtensionManager } from "./Extensions/ExtensionManager";
import { ResponseExtensions } from "./Extensions/ResponseExtensions";
import UserController from "./Controllers/UserController";
import { AuthController } from "./Controllers/AuthController";
import { ControllerBase } from "./Controllers/ControllerBase";
import { AuthSetupService } from "./Services/AuthSetupService";
import * as passport from "passport";
import { IOCContainer } from "./IOCContainer";
import { InversifyExpressServer } from "inversify-express-utils";
import "reflect-metadata";

interface IConfig {
  MONGO_USER: string;
  MONGO_PASSWORD: string;
  MONGO_PATH: string;
  PORT: number;
  ORIGIN_ADDRESS: string;
  APP_SECRET: string;
}

export class App {
  public App: express.Application;

  private Config: IConfig = (process.env as unknown) as IConfig;

  constructor() {
    let container = this.SetupIOCContainer();
    let server = new InversifyExpressServer(container);
    server.setConfig(app => {
      this.App = app;
      this.Init();
    });
    this.App = server.build();
    this.Listen();
  }

  private SetupIOCContainer() {
    let iocContainer = new IOCContainer();
    return iocContainer.Init();
  }

  public Init() {
    this.CheckEnvironmentVariables();

    this.InitializeMiddleware();
    this.InitializeControllers();
    this.InitializeDatabaseConnection();
    this.InitializeModuleExtensions();
    this.SetupServices();
  }

  private CheckEnvironmentVariables() {
    const {
      MONGO_USER,
      MONGO_PASSWORD,
      MONGO_PATH,
      ORIGIN_ADDRESS,
      PORT,
      APP_SECRET
    } = process.env;

    let errorLines = "";
    interface IEnvironmentVariable {
      Name: string;
      Value: string;
    }
    let envVariables: IEnvironmentVariable[] = [
      {
        Name: "MONGO_USER",
        Value: MONGO_USER
      },
      {
        Name: "MONGO_PASSWORD",
        Value: MONGO_PASSWORD
      },
      {
        Name: "MONGO_PATH",
        Value: MONGO_PATH
      },
      {
        Name: "ORIGIN_ADDRESS",
        Value: ORIGIN_ADDRESS
      },
      {
        Name: "PORT",
        Value: PORT
      },
      {
        Name: "APP_Secret",
        Value: APP_SECRET
      }
    ];

    envVariables.forEach(envVariable => {
      if (!envVariable.Value) {
        errorLines += `\n ${envVariable.Name} is not set`;
      }
    });

    if (errorLines) {
      ConsoleLogUtils.LogToConsole(
        "--------------------------------------------------",
        ConsoleTextEffect.FgRed
      );
      ConsoleLogUtils.LogToConsole(
        "Not all environment variables are set up properly",
        ConsoleTextEffect.FgRed
      );
      console.log(errorLines);
      console.log("\nTo fix this: Create a .env file in the server root");
      console.log("and add the above mentioned variables to it");
      ConsoleLogUtils.LogToConsole(
        "--------------------------------------------------",
        ConsoleTextEffect.FgRed
      );
    } else {
      ConsoleLogUtils.LogToConsole(
        "All environment variables present and accounted for",
        ConsoleTextEffect.FgGreen
      );
    }
  }

  private InitializeMiddleware() {
    //Json parser
    this.App.use(bodyParser.json());
    //Cors
    console.log(`Allowing cors for ${this.Config.ORIGIN_ADDRESS}`);
    this.App.use(
      cors({
        origin: this.Config.ORIGIN_ADDRESS
      })
    );

    //cookieparser
    this.App.use(cookieParser(this.Config.APP_SECRET));

    //sessionParser
    this.App.use(
      session({
        secret: this.Config.APP_SECRET
      })
    );

    //Passport setup
    this.App.use(passport.initialize());
    this.App.use(passport.session());

    //Response extensions
    this.App.use((req, res: any, next) => {
      let responseExtensionsManager = new ExtensionManager(
        new ResponseExtensions(res)
      );
      responseExtensionsManager.Init();
      next();
    });
  }

  private InitializeModuleExtensions() {
    // let extensionManager = new ExtensionManager(new ResponseExtensions());
  }

  private InitializeControllers() {
    let controllers: ControllerBase[] = [
      new UserController("/users"),
      new AuthController("/auth")
    ];

    controllers.forEach(controller => {
      this.App.use("/", controller.Router);
    });
  }

  public Listen() {
    this.App.listen(this.Config.PORT, () => {
      console.log(`App listening on port:${this.Config.PORT}`);
    });
  }

  private InitializeDatabaseConnection() {
    const CONNECTION_STRING = `mongodb+srv://${this.Config.MONGO_USER}:${this.Config.MONGO_PASSWORD}${this.Config.MONGO_PATH}?retryWrites=true&w=majority`;
    mongoose
      .connect(CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .catch(reason => {
        ConsoleLogUtils.LogToConsole(
          `
            ----------------------------------------------------
            ${reason}
            ----------------------------------------------------
            `,
          ConsoleTextEffect.BgRed,
          ConsoleColour.Bright
        );
      });
  }

  private SetupServices() {
    let authSetupService = new AuthSetupService();
    authSetupService.Init();
  }
}
