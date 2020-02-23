/** @format */

import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as cors from "cors";
import ConsoleLogHelper, { ConsoleColour as ConsoleTextEffect, ConsoleColour } from "./Helpers/ConsoleLogHelper";

interface IConfig {
	MONGO_USER: string;
	MONGO_PASSWORD: string;
	MONGO_PATH: string;
	PORT: number;
	ORIGIN_ADDRESS: string;
}

class App {
	public App: express.Application;
	public Port: number;

	private Config: IConfig = (process.env as unknown) as IConfig;

	constructor(controllers, port) {
		this.App = express();
		this.Port = port;

		this.CheckEnvironmentVariables();

		this.InitializeMiddleware();
		this.InitializeControllers(controllers);
		this.InitializeDatabaseConnection();
	}

	private CheckEnvironmentVariables() {
		const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

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
			}
		];

		envVariables.forEach((envVariable) => {
			if (!envVariable.Value) {
				errorLines += `\n ${envVariable.Name} is not set`;
			}
		});

		if (errorLines) {
			ConsoleLogHelper.LogToConsole("--------------------------------------------------", ConsoleTextEffect.FgRed);
			ConsoleLogHelper.LogToConsole("Not all environment variables are set up properly", ConsoleTextEffect.FgRed);
			console.log(errorLines);
			console.log("\nTo fix this: Create a .env file in the server root");
			console.log("and add the above mentioned variables to it");
			ConsoleLogHelper.LogToConsole("--------------------------------------------------", ConsoleTextEffect.FgRed);
		} else {
			ConsoleLogHelper.LogToConsole("All environment variables present and accounted for", ConsoleTextEffect.FgGreen);
		}
	}

	private InitializeMiddleware() {
		console.log(this.Config.ORIGIN_ADDRESS);
		this.App.use(bodyParser.json());
		this.App.use(
			cors({
				origin: this.Config.ORIGIN_ADDRESS
			})
		);
	}

	private InitializeControllers(controllers) {
		controllers.forEach((controller) => {
			this.App.use("/", controller.router);
		});
	}

	public Listen() {
		this.App.listen(this.Port, () => {
			console.log(`App listening on the port ${this.Port}`);
		});
	}

	private InitializeDatabaseConnection() {
		mongoose
			.connect(`mongodb+srv://${this.Config.MONGO_USER}:${this.Config.MONGO_PASSWORD}${this.Config.MONGO_PATH}?retryWrites=true&w=majority`, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			})
			.catch((reason) => {
				ConsoleLogHelper.LogToConsole(
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
}

export default App;
