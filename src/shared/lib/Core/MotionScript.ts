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

    let objectsLoading: number[] = [];
    let fixedInterval = undefined;

    window.addEventListener("load", async function(e){      
        MS.dispatchEvent(loadEvent);        
        if(objectsLoading.length > 0)
            await Time.waitUntil(() => objectsLoading.length <= 0);

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
                const eventDetail = { deltaTime: Time.deltaTime, realDeltaTime: Time.realDeltaTime, isFixedTime: false }

                updateEvent.detail = eventDetail;
                drawEvent.detail =   eventDetail;

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
                const eventDetail = { deltaTime: Time.fixedDeltaTime, realDeltaTime: Time.realFixedDeltaTime, isFixedTime: true }
    
                fixedUpdateEvent.detail = eventDetail;
                fixedDrawEvent.detail = eventDetail;
    
                MS.dispatchEvent(fixedUpdateEvent);
                MS.dispatchEvent(fixedDrawEvent);
            }, Time.fixedDeltaTime);
        }        
    }
}