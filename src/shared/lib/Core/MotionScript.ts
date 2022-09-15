import { MSEvent } from "./Events/MSEvent";
import { MSEventKeys } from "./Events/MSEventKeys";
import { MSEventListener } from "./Events/MSEventListener";
import { Time } from "./Time.js";

export namespace MotionScript{
    export const MS = new MSEventListener();

    const loadEvent = new MSEvent(MSEventKeys.Load);
    const setupEvent = new MSEvent(MSEventKeys.Setup);
    const updateEvent = new MSEvent(MSEventKeys.Update);
    const drawEvent = new MSEvent(MSEventKeys.Draw);
    const fixedUpdateEvent = new MSEvent(MSEventKeys.FixedUpdate);
    const fixedDrawEvent = new MSEvent(MSEventKeys.FixedDraw);

    let objectsLoading = 0;
    let fixedInterval = undefined;

    window.addEventListener("load", async function(e){         

        MS.dispatchEvent(loadEvent);        
        if(objectsLoading > 0)
            await Time.waitUntil(() => objectsLoading <= 0);

        MS.dispatchEvent(setupEvent);

        beginFixedLoop();
        nextFrame();

        function nextFrame() {           
            if(!Time.advanceFrame(Time.paused))
                requestAnimationFrame(nextFrame);
            
            if(Time.paused) pausedLoop();
            else gameLoop();                

            requestAnimationFrame(nextFrame);

            function gameLoop(){
                updateEvent.detail = { deltaTime: Time.deltaTime, realDeltaTime: Time.realDeltaTime };
                drawEvent.detail = { deltaTime: Time.deltaTime, realDeltaTime: Time.realDeltaTime };

                MS.dispatchEvent(updateEvent);
                MS.dispatchEvent(drawEvent);
            }

            function pausedLoop(){

            }
        }
    });

    export function endFixedLoop() {
        if(fixedInterval){
            clearInterval(fixedInterval);
            fixedInterval = undefined;
        }
    }

    export function beginFixedLoop() {
        if(fixedInterval){
            endFixedLoop();
        }
        else{
            fixedInterval = setInterval(() => {
                Time.advanceFixedFrame(Time.paused);
    
                fixedUpdateEvent.detail = { deltaTime: Time.fixedDeltaTime, realDeltaTime: Time.realFixedDeltaTime };
                fixedDrawEvent.detail = { deltaTime: Time.fixedDeltaTime, realDeltaTime: Time.realFixedDeltaTime };
    
                MS.dispatchEvent(fixedUpdateEvent);
                MS.dispatchEvent(fixedDrawEvent);
            }, Time.fixedDeltaTime);
        }        
    }
}