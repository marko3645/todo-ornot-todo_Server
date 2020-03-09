/** @format */

import { Response } from "express";

import { IModuleExtender } from "./ExtensionManager";

declare module "express" {
	export interface Response {
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
	private _response: Response;
	constructor(response: Response) {
		this._response = response;
		this.Init();
	}

	public Init() {
		this.Setup200ResponseCodes();
		this.Setup400ResponseCodes();
		this.Setup500ResponseCodes();
	}

	private Setup200ResponseCodes() {
		let obj = this;

		this._response.OK = this.GetStatusSetFunction(obj, 200);
		this._response.Created = this.GetStatusSetFunction(obj, 201);
		this._response.Accepted = this.GetStatusSetFunction(obj, 202);
		this._response.NoContent = this.GetStatusSetFunction(obj, 204);
	}

	private Setup400ResponseCodes() {
		let obj = this;

		this._response.BadRequest = this.GetStatusSetFunction(obj, 400);
		this._response.Unauthorized = this.GetStatusSetFunction(obj, 401);
		this._response.Forbidden = this.GetStatusSetFunction(obj, 403);
		this._response.NotFound = this.GetStatusSetFunction(obj, 404);
		this._response.MethodNotAllowed = this.GetStatusSetFunction(obj, 405);
		this._response.NotAcceptable = this.GetStatusSetFunction(obj, 406);
		this._response.PreconditionFailed = this.GetStatusSetFunction(obj, 412);
		this._response.UnsopportedMediaType = this.GetStatusSetFunction(obj, 415);
	}

	private Setup500ResponseCodes() {
		let obj = this;
		this._response.InternalServerError = this.GetStatusSetFunction(obj, 500);
		this._response.NotImplemented = this.GetStatusSetFunction(obj, 501);
	}

	private GetStatusSetFunction(context, status) {
		return function() {
			return context.SetResponseStatus(this, status);
		};
	}

	private SetResponseStatus(context: unknown, status: number): Response {
		return this.GetResponseContext(context).status(status);
	}

	private GetResponseContext(context: unknown): Response {
		return context as Response;
	}
}
