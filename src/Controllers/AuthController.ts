import { ControllerBase } from "./ControllerBase";
import * as passport from 'passport';

export class AuthController extends ControllerBase{

    constructor(path:string){
        super(path);
        this.InitializeRoutes();
    }

    private InitializeRoutes(){
        this.Router.post('/login', passport.authenticate('local', {
            successRedirect: '/'
        }));
    }
}