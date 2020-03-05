import { expect } from "chai";
import { ResponseExtensions } from "../../Extensions/ResponseExtensions";

describe("ResponseExtensions", () => {
    describe("Setup200ResponseCodes", () => {

        let response;
        before(() => {
            let responseExtentions = new ResponseExtensions();
            responseExtentions.Init();
            response = new Response();
        })

        it('OK sets status to 200', () => {
            response.OK();
            expect(response.status).to.equal(200);
        })
    })
});