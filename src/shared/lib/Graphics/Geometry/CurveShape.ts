import { color } from "../Color";
import { Graphics2D } from "../Graphics";
import { Shape } from "./Shape";
import { MSMath } from '../../Math/MSMath';
import { Rectangle } from "../../Math/Rectangle";

export interface Curve {
    (t: number): number
}

export class CurveShape implements Shape{

    constructor({ curve, lineWeight, color, steps = 20, origin = {x: 0, y: 0}, scale = {x: 1, y: 1}, rotation = 0, length = undefined, bounds }: { curve: Curve; origin?: { x: number; y: number; }, length?: number, scale?: { x: number; y: number; }, rotation?: number; lineWeight?: number, color?: color, steps?: number; bounds?: Rectangle }){
        this.origin   = origin;
        this.scale    = scale;
        this.rotation = rotation;

        this.length     = length;
        this.steps      = steps;
        this.curve      = curve;
        this.color      = color;
        this.lineWeight = lineWeight;
        this.bounds     = bounds;
        this.vertices = this.create();
    }

    vertices: { x: number; y: number; }[];
    origin:   { x: number; y: number; };
    scale:    { x: number; y: number; };
    rotation: number;
    
    length: number;
    steps:  number;
    curve:  Curve;
    color:  color;
    lineWeight: number;
    bounds: Rectangle;

    create(): { x: number; y: number; }[] {
        let v: { x: number; y: number; }[] = [];
        const l = Math.max(this.steps, 1);
        
        for (let n = 0; n <= l; n++)
            v.push({ x: n/l, y: this.curve(n/l) });
        return v;
    }

    draw(context = Graphics2D.context) {
        const o = this.origin;
        const r = this.rotation;
        const s = this.scale;

        const b = this.bounds || new Rectangle({x: 0,y: 0, width: context.canvas.width, height: context.canvas.height});
        b.width  = b?.width  <= 1 ? context.canvas.width  : b.width;
        b.height = b?.height <= 1 ? context.canvas.height : b.height; 
        const lw = this.lineWeight;

        if(this.vertices.length-1 != this.steps) this.vertices = this.create();
        
        const v = this.vertices;
        const c = this.color;

        const w =  context.canvas.width;
        const h =  context.canvas.height;
        
        Graphics2D.executeInSafeMode((ctx: CanvasRenderingContext2D) =>{    
            const p1 = { x: v[0].x, y: v[0].y }
            let   p0 = { x: 0, y: 0 }

            ctx.translate(o.x, o.y);
            ctx.scale(s.x, s.y);
            ctx.rotate(r);

            for(let i = 1; i <= this.steps; i++){
                p0.x = p1.x; p0.y = p1.y;                

                p1.x = v[i].x * w;
                p1.y = v[i].y * h;

                if(p1.x <= b.width)
                    Graphics2D.unsafeLine({ p0, p1, weight: lw, color: c, context: ctx });  
            }
        }, context);
    }

}