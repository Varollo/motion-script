import { color } from '../Color';
import { Shape } from "./Shape";
import { Graphics2D } from '../Graphics';
import { TextStyle } from '../Text/TextStyle';

export class GraphShape implements Shape{

    constructor({ length = undefined, origin = { x: 0, y: 0 }, rotation = 0, scale = { x: 1, y: 1 }, color, lineWeight = 1, text}: { length?: number; origin?: { x: number; y: number; }; rotation?: number; scale?: { x: number; y: number; }, color?: color | {x: color, y: color}; lineWeight?: number; text?: { x?: {text?: string, style?: TextStyle}, y?: {text?: string, style?: TextStyle} } }){
        this.vertices     = this.create();        

        this.origin     = origin;
        this.rotation   = rotation;
        this.scale      = scale;
  
        this.text       = text;
        this.color      = color;
        this.length     = length;
        this.lineWeight = lineWeight;
    }

    vertices:  {x: number, y: number}[ ][ ];

    origin:    { x: number, y: number, };
    scale:     { x: number; y: number; };
    rotation:   number;

    text:       { x?: {text?: string, style?: TextStyle}, y?: {text?: string, style?: TextStyle} }
    color:      color | {x: color, y: color};
    length:     number;
    lineWeight: number;

    public create(): {x: number, y: number}[ ][ ] {
        return [
             [
                {x: -.05, y: 0},
                {x:    1, y: 0}
             ],
             [
                {x: 0, y: -.05},
                {x: 0, y:    1}
             ],
             [
                {x: .025, y:  .025},
                {x:-.025, y: -.025}
             ]
        ];
    }

    draw(context = Graphics2D.context) {
        this.validateShape(context);

        const o = this.origin;
        const w = this.lineWeight;
        const r = this.rotation;
        const s = this.scale;

        const l = this.length;
        const v = this.vertices;
        const t = this.text;
        const c = this.color;

        const x = this.getX(c, t, v, l);
        const y = this.getY(c, t, v, l);
        
        Graphics2D.executeInSafeMode((c: CanvasRenderingContext2D) =>{    
            c.translate(o.x, o.y);
            c.scale(s.x, s.y);
            c.rotate(r);

            Graphics2D.unsafeLine({ p0: x.p0, p1: x.p1, weight: w, color: y.c, context: c });            
            Graphics2D.unsafeLine({ p0: y.p0, p1: y.p1, weight: w, color: x.c, context: c });

            c.scale(s.x, s.y)
            c.rotate(r);

            Graphics2D.unsafeFillText({ text: x.t.text, p: x.pt, style: x.t.style, context: c });
            Graphics2D.unsafeFillText({ text: y.t.text, p: y.pt, style: y.t.style, context: c });
        },context);
    }

    private getY(c: color | { x: color; y: color; }, t: { x?: { text?: string; style?: TextStyle; }; y?: { text?: string; style?: TextStyle; }; }, v: { x: number; y: number; }[][], l: number) {
        return {
            c: (c as { x: color; y: color; }).y || c as color,
            t: t.y,
            p0: {
                x: v[1][0].x * l,
                y: v[1][0].y * l,
            },
            p1: {
                x: v[1][1].x * l,
                y: v[1][1].y * l,
            },
            pt: {
                x: v[2][1].x * l,
                y: v[2][1].y * l,
            },
        };
    }

    private getX(c: color | { x: color; y: color; }, t: { x?: { text?: string; style?: TextStyle; }; y?: { text?: string; style?: TextStyle; }; }, v: { x: number; y: number; }[][], l: number) {
        return {
            c: (c as { x: color; y: color; }).x || c as color,
            t: t.x,
            p0: {
                x: v[0][0].x * l,
                y: v[0][0].y * l,
            },
            p1: {
                x: v[0][1].x * l,
                y: v[0][1].y * l,
            },
            pt: {
                x: v[2][0].x * l,
                y: v[2][0].y * l,
            },
        };
    }

    private validateShape(context: CanvasRenderingContext2D) {
        const fallbackStyle: TextStyle = { size: context.font.split(' ')[0], font: context.font.split(' ')[1] } 
        const castColor = this.color as {x: color, y: color};

        if (!this.length)
            this.length = Math.max(context.canvas.width, context.canvas.height);

        if (castColor) {
            this.color = { x: castColor.x || this.color as color, y: castColor.y || this.color as color };
        }
        else this.color = this.color || context.strokeStyle;

        if(!this.text) this.text = {x: {text: 'X', style: fallbackStyle}, y: {text: 'y', style: fallbackStyle}};
        else if (this.text.x && !this.text.y) this.text.y = this.text.x;
        else if (this.text.y && !this.text.x) this.text.x = this.text.y;

        if (this.text.x) {
            this.text.x.text = this.text.x.text || 'x';
            this.text.x.style = {
                color: this.text.x.style.color || castColor.x,
                size:  this.text.x.style.size  || fallbackStyle.size,
                font:  this.text.x.style.font  || fallbackStyle.font,
            };

            this.text.y = this.text.y || this.text.x;
        }
        else this.text = { y: this.text.y, x: { text:'X', style: { color: castColor.x || this.color as color, size: fallbackStyle.size, font: fallbackStyle.font } } };

        if (this.text.y) {
            this.text.y.text = this.text.y.text || 'y';
            this.text.y.style = {
                color: this.text.y.style.color || castColor.y,
                size:  this.text.y.style.size  || fallbackStyle.size,
                font:  this.text.y.style.font  || fallbackStyle.font,
            };

            this.text.x = this.text.x || this.text.y;
        }
        else this.text.y.style = { color: castColor.y || this.color as color, size: fallbackStyle.size, font: fallbackStyle.font };
    }
}