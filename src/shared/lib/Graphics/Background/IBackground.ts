export interface IBackground{
    drawBackground2D(ctx : CanvasRenderingContext2D, deltaTime: number);
    drawBackgroundWebGL(ctx : WebGLRenderingContext, deltaTime: number);
}