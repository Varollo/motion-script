import { Color, color } from '../Color';
import { Background } from './Background';
import { Graphics2D } from '../Graphics';

export class FlatBackground implements Background{

    constructor({ fill, isFixedDraw = false }: { fill: color; isFixedDraw?: boolean; }) {
        this.fill = fill;
        this.isFixedDraw = isFixedDraw;
    }

    origin:      { x: number; y: number; };
    scale:       { x: number; y: number; };
    rotation:    number;
    fill:        color;
    isFixedDraw: boolean;

    drawBackground2D(ctx: CanvasRenderingContext2D, deltaTime: number) { 
        Graphics2D.clear(this.fill, ctx);
    }

    drawBackgroundWebGL(ctx: WebGLRenderingContext, deltaTime: number) {
        const col : Color = this.fill instanceof Color ? this.fill : Color.FromString(this.fill as string);
        ctx.clearColor(col.r, col.g, col.b, col.a);
    }
}