export { }

export declare namespace Pvl {
    export interface IRadio{
        disable:boolean,
        checked:boolean,
        label:string
    }

    export interface IOnRadios{
        (radio:number, radios?: Array<Pvl.IRadio>):void;
    }
}

