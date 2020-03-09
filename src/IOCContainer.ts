
import { Container } from "inversify";
import "reflect-metadata";

import { IUserRepository, UserRepository } from "./DataAccess/Repositories/UserRepository";

export const INJECTABLES = {
  UserRepository: Symbol.for("UserRepository")
};

export class IOCContainer{
    private _container:Container;
    public Init(){
        this._container = new Container();
        this.BindTypes();

        return this._container;
    }

    private BindTypes() {
        this._container.bind<IUserRepository>(INJECTABLES.UserRepository).to(UserRepository);
    }
}