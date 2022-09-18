import { Color, color } from '../Color';
import { Background } from './Background';
import { Graphics, Graphics2D } from '../Graphics';
import { MSMath } from '../../Math/MSMath';

export class GridBackground implements Background{

    constructor({ origin = { x: 0, y: 0 }, scale = { x: 1, y: 1 }, rotation = 0, fill, stroke, spacing, weight, isFixedDraw = false }: { origin?: { x: number; y: number; }; scale?: { x: number; y: number; }; rotation?: number; fill?: color; stroke?: color; spacing?: number; weight?: number; isFixedDraw?: boolean; } = {}) {
        this.origin      = origin;
        this.scale       = scale;
        this.rotation    = rotation;
        this.fill        = fill;
        this.stroke      = stroke;
        this.spacing     = spacing;
        this.weight      = weight;
        this.isFixedDraw = isFixedDraw;
    }

    origin:     { x: number, y: number };
    scale:      { x: number, y: number };
    rotation:    number;
    isFixedDraw: boolean;
    spacing:     number;
    weight:      number;
    stroke:      color;
    fill:        color;

    drawBackground2D(context: CanvasRenderingContext2D, deltaTime: number) { 
        const c  = this.stroke.toString() || context.strokeStyle;
        const f  = this.fill.toString()   || context.fillStyle;
        const lw = this.weight            || context.lineWidth;
        const d  = this.spacing           || lw * 20;

        const w  = context.canvas.width;
        const h  = context.canvas.height;
        const l  = Math.max(w, h);

        const o  = this.origin;
        const s  = this.scale;
        const r  = this.rotation;
        
        Graphics2D.executeInSafeMode((ctx: CanvasRenderingContext2D) => {    
            ctx.rotate (r);
            ctx.scale  (s.x, s.y);
            
            Graphics2D.clear(f, ctx);

            for(let i = -l; i < l; i += d){
                const p0 = { x: MSMath.clamp(i + o.x, 0, w), y: -o.y, }
                const p1 = { x: p0.x, y: h, }

                const q0 = { x: -o.x, y: MSMath.clamp(i + o.y, 0, h) }
                const q1 = { x: w, y: q0.y }
                
                Graphics2D.unsafeLine({ p0, p1, weight: lw, color: c, context: ctx });
                Graphics2D.unsafeLine({ p0: q0, p1: q1, weight: lw, color: c, context: ctx });
            }
        });
    }

    drawBackgroundWebGL(ctx: WebGLRenderingContext, deltaTime: number) {
        const col : Color = this.fill instanceof Color ? this.fill : Color.FromString(this.fill as string);
        ctx.clearColor(col.r, col.g, col.b, col.a);
    }
}