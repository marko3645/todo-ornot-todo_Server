import { Router } from "express";
import * as express from "express";

export class ControllerBase{

    public Router:Router = express.Router();
    public Path:string
    constructor(path:string){
        this.Path = path;
    }

}