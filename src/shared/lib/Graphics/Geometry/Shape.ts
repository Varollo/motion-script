import { color } from "../Color";

export interface Shape{
    vertices: {x: number, y: number}[ ] | {x: number, y: number}[ ][ ],
    origin:   {x: number, y: number},
    scale:    {x: number, y: number},
    rotation:  number,

    create(): {x: number, y: number}[ ] | {x: number, y: number}[ ][ ],
    draw(ctx?:  RenderingContext),
}