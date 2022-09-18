import { Debugger } from '../Debug/Debugger.js';
import { color, Color } from './Color.js';
import { Background } from './Background/Background';
import { MotionScript } from '../Core/MotionScript';
import { MSEventKeys } from "../Core/Events/MSEventKeys";
import { MSEvent } from '../Core/Events/MSEvent';
import { TextStyle } from './Text/TextStyle';

export enum CanvasContextType{ Canvas2D = '2d', Canvas3D = 'webgl' }

export class Graphics {
    protected static readonly CANVAS_DEFAULT_WIDTH = 800;
    protected static readonly CANVAS_DEFAULT_HEIGHT = 600;
    protected static readonly CANVAS_DEFAULT_PARENT = 'body';

    public static canvasContext : CanvasContextType = CanvasContextType.Canvas2D;

    protected static _canvas: HTMLCanvasElement;
    protected static _context: RenderingContext;
    protected static _background: Background;

    public static get background(): Background { return Graphics._background; }
    public static set background(value: Background) { Graphics._background = value; }

    public static get context(): RenderingContext { return Graphics._context; }
    protected static set context(value: RenderingContext) { Graphics._context = value; }

    public static get canvas(): HTMLCanvasElement { return Graphics._canvas; }    
    public static set canvas(value: HTMLCanvasElement | string) {        
        let canvas : HTMLCanvasElement;
        let ctx : RenderingContext;

        if (!value)                                  throw Debugger.error("Canvas cannot be set to null!!!",'Graphics', new ReferenceError);                    
        else if (value instanceof HTMLCanvasElement) canvas = value as HTMLCanvasElement;
        else                                         canvas = document.getElementById(value as string) as HTMLCanvasElement;                    
        if(!canvas)                                  throw Debugger.error(`Couldn't get Canvas \"${canvas}\"`, "Graphics", new ReferenceError);  

        ctx = canvas.getContext(Graphics.canvasContext);

        if(ctx) { 
            Graphics._canvas = canvas; 
            Graphics.context = ctx; 
        }
        else {
            throw Debugger.error(`Couldn't get context in Canvas \"${canvas}\"`, "Graphics", new TypeError);  
        }

        MotionScript.MS.addEventListener(MSEventKeys.Draw,      Graphics.Draw, { order: -1 });
        MotionScript.MS.addEventListener(MSEventKeys.FixedDraw, Graphics.Draw, { order: -1 });
    }

    public static setCanvas(canvas: HTMLCanvasElement | string, canvasOptions: {width: number, height: number} = {width: undefined, height: undefined}){
        this.canvas = canvas;        
        if(canvasOptions.width) this.canvas.width = canvasOptions.width;
        if(canvasOptions.height) this.canvas.height = canvasOptions.height;
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

    private static Draw(e: MSEvent) {
        if(!Graphics.context) return;
        switch (Graphics.canvasContext) {
            case CanvasContextType.Canvas3D:
                if(Graphics.background && Graphics.background.isFixedDraw == e.detail.isFixedTime)
                    Graphics.background.drawBackgroundWebGL(Graphics.context as WebGLRenderingContext, e.detail.deltaTime);
                break;
        
            default:
                if(Graphics.background && Graphics.background.isFixedDraw == e.detail.isFixedTime)
                    Graphics.background.drawBackground2D(Graphics.context as CanvasRenderingContext2D, e.detail.deltaTime);
                break;
        }
    }
}

export class Graphics2D extends Graphics{

    protected static override _context : CanvasRenderingContext2D;
    public static override get context(): CanvasRenderingContext2D {return this._context}

    public static setFilters(filters: string, context = Graphics2D.context){
        if(context)
            context.filter = filters;
    }

    public static clearFilters(context = Graphics2D.context){
        if(context){
            context.filter = 'none';
        }
    }

    public static executeInSafeMode(callback: {(c: CanvasRenderingContext2D)}, context = Graphics2D.context){
        if(context){
            context.save();
            callback(context);
            context.restore();
        }
    }

    public static executePathInSafeMode(callback: {(c: CanvasRenderingContext2D)}, context = Graphics2D.context){ Graphics2D.executeInSafeMode((c) => Graphics2D.executePath, context); }

    public static executePath(callback: {(c: CanvasRenderingContext2D)}, context = Graphics2D.context){
        context.beginPath();        
        callback(context);
        context.closePath();
    }    

    public static clear(clearColor: color = null, context = Graphics2D.context) { Graphics2D.executeInSafeMode((c) => {
        Graphics2D.unsafeClear(clearColor, c);
    }, context); }

    public static unsafeClear(clearColor: color, context = Graphics2D.context) {
        const canvas = context.canvas;
        context.fillStyle = clearColor.toString() || context.fillStyle;

        if (clearColor != null) context.fillRect(0, 0, canvas.width, canvas.height);
        else context.clearRect(0, 0, canvas.width, canvas.height);
    }

    public static fillRect({ x, y, width, height, color = undefined, context = Graphics2D.context }: { x: number; y: number; width: number; height: number; color?: color; context?: CanvasRenderingContext2D; })  { Graphics2D.executeInSafeMode((c) => {
        Graphics2D.unsafeFillRect({x, y, width, height, color, c});
    }, context); }

    public static unsafeFillRect({ x, y, width, height, color = undefined, c = Graphics2D.context }: { x: number; y: number; width: number; height: number; color?: color; c?: CanvasRenderingContext2D; }) {
        c.fillStyle = color.toString() || c.fillStyle;
        c.fillRect(x, y, width, height);
    }

    public static unsafePrepareText({ font, size, }: TextStyle, context){
        const fontStyle = context.font.split(' ');
        context.font = `${ size && size as number ? `${size}px` : size || fontStyle[0]} ${font || fontStyle[1]}`; // [size as number ? `${size}px` : size] => dumb workaround to use instance of a union
    }

    public static fillText(text: any, {x, y}: {x: number, y: number}, { color = undefined, font = undefined, size = undefined  }: TextStyle, maxWidth?: number, context = Graphics2D.context) { Graphics2D.executeInSafeMode((c) => {
        Graphics2D.unsafeFillText({ text, p: { x, y }, style: { color, font, size }, maxWidth, context: c });
    }, context); }

    public static unsafeFillText({ text, p, style, maxWidth = undefined, context = Graphics2D.context }: { text: any; p: { x: number; y: number; }; style: TextStyle; maxWidth?: number; context?: CanvasRenderingContext2D; }) {
        Graphics2D.unsafePrepareText(style, context);
        context.fillStyle = style?.color?.toString() || context.fillStyle;
        context.fillText(text, p.x, p.y, maxWidth);
    }

    public static strokeText(text: any, x: number, y:number, { color = undefined, font = undefined, size = undefined  }: TextStyle, maxWidth?: number, context = Graphics2D.context) { Graphics2D.executeInSafeMode((c) => {
        this.unsafeStrokeText(text, x, y, { color, font, size }, maxWidth, c);
    }, context); }

    public static unsafeStrokeText(text: any, x: number, y:number, { color = undefined, font = undefined, size = undefined  }: TextStyle, maxWidth?: number, context = Graphics2D.context){
        Graphics2D.unsafePrepareText({ font, size}, context);
        context.strokeStyle = color.toString() ?? context.strokeStyle;
        context.strokeText(text, x, y, maxWidth);
    }    

    public static line({ p0, p1, weight, color, context = Graphics2D.context }: { p0: { x: number; y: number; }; p1: { x: number; y: number; }; weight?: number; color?: color; context?: CanvasRenderingContext2D; }) { Graphics2D.executeInSafeMode((c) => {
        Graphics2D.unsafeLine({ p0, p1, weight, color, context: c });
    }, context); }

    public static unsafeLine({ p0, p1, weight, color, context = Graphics2D.context }: { p0: { x: number; y: number; }; p1: { x: number; y: number; }; weight?: number; color?: color; context?: CanvasRenderingContext2D; }) { Graphics2D.executePath((c) => {
        c.strokeStyle = color.toString() || c.strokeStyle; 
        c.lineWidth   = weight           || c.lineWidth;     

        c.moveTo(p0.x, p0.y);
        c.lineTo(p1.x, p1.y);   

        c.stroke();
    }, context); }

    public static strokeCircle({origin, radius, lineWeight, color, context = Graphics2D.context} : {origin: {x: number, y: number}, radius: number, lineWeight?: number, color?: color, context?: CanvasRenderingContext2D}) { Graphics2D.executeInSafeMode((c) => {
        Graphics2D.unsafeStrokeCircle(origin, radius, color, lineWeight, c);
    }, context); }

    private static unsafeStrokeCircle(origin: { x: number; y: number; }, radius: number, color: color, lineWeight: number, context = Graphics2D.context) { Graphics2D.executePath((c) => {
        c.arc(origin.x, origin.y, radius, 0, 2 * Math.PI, false);
        c.strokeStyle = color.toString() || c.strokeStyle;
        c.lineWidth = lineWeight || c.lineWidth;
        c.stroke();
    }, context); }
}