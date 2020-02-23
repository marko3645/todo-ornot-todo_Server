import App from "./App";
import UserController from "./Controllers/UserController";
import "dotenv/config";

const app = new App([new UserController()], 5000);

app.Listen();