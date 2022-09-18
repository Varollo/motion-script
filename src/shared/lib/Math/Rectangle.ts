import { MSMath } from "./MSMath";

export class Rectangle{

    constructor({x,y,width,height} : {x?:number, y?:number, width?: number, height?: number}) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 1;
        this.height = height || 1;
    }

    x : number = 0;
    y : number = 0;
    width : number = 0;
    height : number = 0;

    public clampPoint(p: {x: number, y: number}) : {x: number, y: number}{
        return { x: MSMath.clamp(p.x,this.x,this.width), y: MSMath.clamp(p.y, this.y, this.height) };
    }
}