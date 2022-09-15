import { MotionScript } from '../../shared/lib/Core/MotionScript.js';
import { MSEventKeys } from "../../shared/lib/Core/Events/MSEventKeys";
import { Graphics } from '../../shared/lib/Graphics/Graphics.js';
import { FlatBackground } from '../../shared/lib/Graphics/Background/FlatBackground';
import { Color } from '../../shared/lib/Graphics/Color.js';
import { IBackground } from '../../shared/lib/Graphics/Background/IBackground';
import { Time } from '../../shared/lib/Core/Time';
import { MSEvent as MSEvent } from "../../shared/lib/Core/Events/MSEvent";
import { Graphics2D } from '../../shared/lib/Graphics/Graphics';

const rOffset = Math.random();
const gOffset = Math.random();
const bOffset = Math.random();

let background : IBackground;


MotionScript.MS.addEventListener(MSEventKeys.Setup, () => {
    Graphics.setCanvas('mainCanvas', { width: 1920, height: 1080 });
    background = new FlatBackground(Color.black);
    Graphics.background = background;
});

MotionScript.MS.addEventListener(MSEventKeys.Draw, (e: MSEvent) =>{
    const t = Math.round(((Math.sin(Time.frameCount * e.detail.deltaTime * 0.001) + 1) / 2) * 255);
    Graphics2D.fillRect(100,100,100,100, new Color(t + rOffset * 255, t + gOffset * 255, t + bOffset * 255));
    
    (Graphics.context as CanvasRenderingContext2D).fillStyle = 'white';
    (Graphics.context as CanvasRenderingContext2D).font='100px sans-serif';
    (Graphics.context as CanvasRenderingContext2D).fillText(`t: ${t}`, 500, 400);    
    (Graphics.context as CanvasRenderingContext2D).fillText(`delta time: ${e.detail.deltaTime}`, 500, 500);    
    (Graphics.context as CanvasRenderingContext2D).fillText(`real delta time: ${e.detail.realDeltaTime}`, 500, 600);    
    (Graphics.context as CanvasRenderingContext2D).fillStyle = 'black';
});