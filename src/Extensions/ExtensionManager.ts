

export interface IModuleExtender{
    Init: () => void;
}

export class ExtensionManager{

    private _extenders:IModuleExtender[];

    constructor(... moduleExtenders:IModuleExtender[]){
        this._extenders = moduleExtenders;
    }

    public Init():void{
        this._extenders.forEach((extender:IModuleExtender) => {
            extender.Init();
        });
    }

}