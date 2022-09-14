import { Color } from '../Color';
import { IBackground } from './IBackground';
import { Graphics } from '../Graphics';
import { Rectangle } from '../Rectangle';
import { Debugger } from '../../Debug/Debugger';

export class FlatBackground implements IBackground{
    
    fill: string | Color;

    constructor(fill: Color | string = Color.black) {
        this.fill = fill;
    }

    drawBackground2D(ctx: CanvasRenderingContext2D, deltaTime: number) {
        const canvas = ctx.canvas;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawBackgroundWebGL(ctx: WebGLRenderingContext, deltaTime: number) {
        const col : Color = this.fill instanceof Color ? this.fill : Color.FromString(this.fill as string);
        ctx.clearColor(col.r, col.g, col.b, col.a);
    }
}