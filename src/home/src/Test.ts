import { MotionScript } from '../../shared/lib/Core/MotionScript.js';
import { MSEventKeys } from "../../shared/lib/Core/Events/MSEventKeys";
import { Graphics } from '../../shared/lib/Graphics/Graphics.js';
import { Time } from '../../shared/lib/Core/Time';
import { MSEvent } from "../../shared/lib/Core/Events/MSEvent";
import { Graphics2D } from '../../shared/lib/Graphics/Graphics';
import { GridBackground } from '../../shared/lib/Graphics/Background/GridBackground.js';
import { GraphShape } from '../../shared/lib/Graphics/Geometry/GraphShape.js';
import { Curve, CurveShape } from '../../shared/lib/Graphics/Geometry/CurveShape';
import { Rectangle } from '../../shared/lib/Math/Rectangle.js';
import { Easing } from '../../shared/lib/Math/Easing.js';

const origin     = { x: 100, y: 430 }
const background = new GridBackground({ origin, fill: '#111', stroke: '#222', isFixedDraw: true });
const graph      = new GraphShape    ({ origin, scale: {x: 1, y: -1}, color: {x: '#EE5577', y: '#77EE55'}, lineWeight: 1.5, text: { x: {style:{ font: 'Nunito', size: 20} }, y: {style:{ font: 'Nunito', size: 20} } } });
const curve      = new CurveShape    ({ origin, scale: {x: 1, y: -1}, curve: Curve, color: "#FF88AA", lineWeight: 1.5 , bounds: new Rectangle({width: 2}), steps: 1000});

MotionScript.MS.addEventListener(MSEventKeys.Setup, Setup);
MotionScript.MS.addEventListener(MSEventKeys.FixedDraw, Draw);

function Setup() {
    Graphics.setCanvas('mainCanvas', { width: 480 * 2, height: 270 * 2 });
    Graphics.background = background;
    Graphics2D.clearFilters();
    Time.timeScale = 0.001;
    Time.pause();
}

function Draw(e: MSEvent){
    Graphics2D.fillText(`t: ${Time.time.toFixed(2)}`, {x: 5, y: 30}, {color: '#555', font: 'Nunito', size: 25});
    graph.draw();  
    curve.draw();
    curve.bounds.width = Easing.easeInOut({ k: Time.time, s: 2, e: Graphics2D.canvas.width, d: 3, h: 0.5 }, Easing.EasingFunctions.quadratic, Easing.EasingFunctions.quadratic);
}

function Curve(t: number): number{
    return t * t;
}