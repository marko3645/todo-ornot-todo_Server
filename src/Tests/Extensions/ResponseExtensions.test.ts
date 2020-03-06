import { expect } from "chai";
import { ResponseExtensions } from "../../Extensions/ResponseExtensions";
import { Response } from "express";
import * as express from "express";

interface StatusSetter {
  FuncName: string;
  ExpectedStatus: number;
}

describe("ResponseExtensions", () => {
  let response: Response;
  before(() => {
    response = express.response;
    let responseExtentions = new ResponseExtensions(response);
    responseExtentions.Init();
  });
  describe("Setup200ResponseCodes", () => {
    let setStatusFunctions: StatusSetter[] = [
      { FuncName: "OK", ExpectedStatus: 200 },
      { FuncName: "Created", ExpectedStatus: 201 },
      { FuncName: "Accepted", ExpectedStatus: 202 },
      { FuncName: "NoContent", ExpectedStatus: 204 },
    ];

    GenerateTestsFor(setStatusFunctions);
  });
  describe("Setup400ResponseCodes", () => {
    let setStatusFunctions: StatusSetter[] = [  
        { FuncName: "BadRequest", ExpectedStatus: 400 },
        { FuncName: "Unauthorized", ExpectedStatus: 401 },
        { FuncName: "Forbidden", ExpectedStatus: 403 },
        { FuncName: "NotFound", ExpectedStatus: 404 },
        { FuncName: "MethodNotAllowed", ExpectedStatus: 405 },
        { FuncName: "NotAcceptable", ExpectedStatus: 406 },
        { FuncName: "PreconditionFailed", ExpectedStatus: 412 },
        { FuncName: "UnsopportedMediaType", ExpectedStatus: 415 }
      ];

      GenerateTestsFor(setStatusFunctions);
  });

  describe("Setup500ReponseCodes", () => {
    let setStatusFunctions: StatusSetter[] = [  
        { FuncName: "InternalServerError", ExpectedStatus: 500 },
        { FuncName: "NotImplemented", ExpectedStatus: 501 }
      ];

      GenerateTestsFor(setStatusFunctions);
  })

  function GenerateTestsFor(statusSetters: StatusSetter[]) {
    statusSetters.forEach((statusSetter: StatusSetter) => {
      it(`Sets status to ${statusSetter.ExpectedStatus} for ${statusSetter.FuncName}()`, () => {
        response[statusSetter.FuncName]();
        expect(response.statusCode).to.equal(statusSetter.ExpectedStatus);
      });
    });
  }
});
