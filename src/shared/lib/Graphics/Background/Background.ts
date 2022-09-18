export interface Background{
    origin: {x: number, y: number},
    scale:  {x: number, y: number},
    rotation: number,
    isFixedDraw: boolean,

    drawBackground2D(ctx : CanvasRenderingContext2D, deltaTime: number),
    drawBackgroundWebGL(ctx : WebGLRenderingContext, deltaTime: number),
}