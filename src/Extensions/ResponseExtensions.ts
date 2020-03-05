import { Request, Response } from "express";

import { IModuleExtender } from "./ExtensionManager";

declare module "express" {
  export class Response {
    //200's
    OK(): Response; //200
    Created(): Response; //201
    Accepted(): Response; //202
    NoContent(): Response; //204
    //400's
    BadRequest(): Response; //400
    Unauthorized(): Response; //401
    Forbidden(): Response; //403
    NotFound(): Response; //404
    MethodNotAllowed(): Response; //405
    NotAcceptable(): Response; //406
    PreconditionFailed(): Response; //412
    UnsopportedMediaType(): Response; //415

    //500's
    InternalServerError(): Response; //500;
    NotImplemented(): Response; //501
  }
}

export class ResponseExtensions implements IModuleExtender {
  constructor() {
    this.Init();
  }

  public Init() {
    this.Setup200ResponseCodes();
    this.Setup400ResponseCodes();
    this.Setup500ResponseCodes();
  }

  private Setup200ResponseCodes() {
    let obj = this;
    Response.prototype.OK = function() {
      return obj.SetResponseStatus(this, 200);
    };

    Response.prototype.Created = function() {
      return obj.SetResponseStatus(this, 201);
    };

    Response.prototype.Accepted = function() {
      return obj.SetResponseStatus(this, 202);
    };

    Response.prototype.NoContent = function() {
      return obj.SetResponseStatus(this, 204);
    };
  }

  private Setup400ResponseCodes() {
    let obj = this;

    Response.prototype.BadRequest = function() {
      return obj.SetResponseStatus(this, 400);
    };

    Response.prototype.Unauthorized = function() {
      return obj.SetResponseStatus(this, 401);
    };

    Response.prototype.Forbidden = function() {
      return obj.SetResponseStatus(this, 403);
    };

    Response.prototype.NotFound = function() {
      return obj.SetResponseStatus(this, 404);
    };

    Response.prototype.MethodNotAllowed = function() {
      return obj.SetResponseStatus(this, 405);
    };

    Response.prototype.NotAcceptable = function() {
      return obj.SetResponseStatus(this, 406);
    };

    Response.prototype.PreconditionFailed = function() {
      return obj.SetResponseStatus(this, 412);
    };

    Response.prototype.UnsopportedMediaType = function() {
      return obj.SetResponseStatus(this, 415);
    };
  }

  private Setup500ResponseCodes() {
    let obj = this;
    Response.prototype.InternalServerError = function() {
      return obj.SetResponseStatus(this, 500);
    };

    Response.prototype.NotImplemented = function() {
      return obj.SetResponseStatus(this, 501);
    };
  }

  private SetResponseStatus(context: unknown, status: number): Response {
    return this.GetResponseContext(context).status(status);
  }

  private GetResponseContext(context: unknown): Response {
    return context as Response;
  }
}
