import { MotionScript, MSEventKeys } from '../../shared/lib/Core/MotionScript.js';
import { Graphics, Graphics2D } from '../../shared/lib/Graphics/Graphics.js';
import { FlatBackground } from '../../shared/lib/Graphics/Background/FlatBackground';
import { Color } from '../../shared/lib/Graphics/Color.js';
import { IBackground } from '../../shared/lib/Graphics/Background/IBackground';

let background : IBackground;

MotionScript.MS.addEventListener(MSEventKeys.Setup, () => {
    Graphics.canvas = 'mainCanvas';
    Graphics.background = background = new FlatBackground(Color.black);   
});