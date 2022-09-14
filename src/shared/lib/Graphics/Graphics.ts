import { Debugger } from '../Debug/Debugger.js';
import { Color } from './Color.js';
import { IBackground } from './Background/IBackground';
import { MotionScript, MSEventKeys } from '../Core/MotionScript';

export enum CanvasContextType{ CANVAS_2D = '2d', CANVAS_3D = 'webgl' }

export class Graphics {
    protected static readonly CANVAS_DEFAULT_WIDTH = 800;
    protected static readonly CANVAS_DEFAULT_HEIGHT = 600;
    protected static readonly CANVAS_DEFAULT_PARENT = 'body';

    public static canvasContext : CanvasContextType = CanvasContextType.CANVAS_2D;

    protected static _canvas: HTMLCanvasElement;
    protected static _context: RenderingContext;
    protected static _background: IBackground;

    public static get background(): IBackground { return Graphics._background; }
    public static set background(value: IBackground) { Graphics._background = value; }

    public static get context(): RenderingContext { return Graphics._context; }
    protected static set context(value: RenderingContext) { Graphics._context = value; }

    public static get canvas(): HTMLCanvasElement { return Graphics._canvas; }    
    public static set canvas(value: HTMLCanvasElement | string) {        
        let canvas : HTMLCanvasElement;
        let ctx : RenderingContext;

        if(!value) throw Debugger.error("Canvas cannot be set to null!!!",'Graphics', new ReferenceError);                    
        else if(value instanceof HTMLCanvasElement) canvas = value as HTMLCanvasElement;
        else canvas = document.getElementById(value as string) as HTMLCanvasElement;            
        if(!canvas) throw Debugger.error(`Couldn't get Canvas \"${canvas}\"`, "Graphics", new ReferenceError);  

        ctx = canvas.getContext(Graphics.canvasContext);

        if(ctx) { Graphics._canvas = canvas; Graphics.context = ctx; }
        else throw Debugger.error(`Couldn't get context in Canvas \"${canvas}\"`, "Graphics", new TypeError);  
        
        MotionScript.MS.addEventListener(MSEventKeys.Draw, Graphics.Draw);
    }

    public static createCanvas(width = Graphics.CANVAS_DEFAULT_WIDTH, height = Graphics.CANVAS_DEFAULT_HEIGHT, parentElement?: HTMLElement, options?: ElementCreationOptions): HTMLCanvasElement {
        const newCanvas = document.createElement('canvas', options);

        newCanvas.width = width;
        newCanvas.height = height;

        parentElement = parentElement ?? document.getElementsByTagName(Graphics.CANVAS_DEFAULT_PARENT)[0];

        parentElement.appendChild(newCanvas);
        Graphics.canvas = newCanvas;

        return newCanvas;
    }

    static Draw(e: CustomEvent) {
        if(!Graphics.context) return;
        switch (Graphics.canvasContext) {
            case CanvasContextType.CANVAS_3D:
                Graphics.background.drawBackgroundWebGL(Graphics.context as WebGLRenderingContext, e.detail);
                break;
        
            default:
                Graphics.background.drawBackground2D(Graphics.context as CanvasRenderingContext2D, e.detail);
                break;
        }
    }
}

export class Graphics2D extends Graphics{

    protected static override _context : CanvasRenderingContext2D;

    public static fill(color?: Color | string | CanvasGradient | CanvasPattern, context?: CanvasRenderingContext2D){
        context =  context ?? Graphics2D._context;
        color = color ?? context.fillStyle;

        context.save();
        const castColor: any = (color instanceof Color) ? color.toString() : color;        

        context.fillStyle = castColor;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.restore();
    }

    public static fillRect(x: number, y: number, width: number, height: number, color?: Color, context = Graphics2D._context) {
        const save = context.fillStyle;

        context.fillStyle = color?.toString() ?? context.fillStyle;
        context.fillRect(x,y,width,height);

        context.fillStyle = save;
    }
}