export { }

export declare namespace Pvl {
    export interface IRadio{
        disable?:boolean,
        checked:boolean,
        label:string,
        icon?:string
    }

    export interface IOnRadios{
        (radio:number, radios?: Array<Pvl.IRadio>):void;
    }

    export interface IList{
        disable?:boolean,
        checked?:boolean,
        label:string,
        icon?:string
    }

    export interface IOnList{
        (index:number, list?: Array<Pvl.IList>):void;
    }
}

