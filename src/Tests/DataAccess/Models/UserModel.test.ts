import { expect } from "chai";
import {UserModel} from '../../../DataAccess/Models/UserModel'

describe("UserModel", () => {
    it("Should create the correct properties for the model", () => {
        let user = new UserModel();
        expect(user).to.have.property("Email");
        expect(user).to.have.property("Password");
    })
})