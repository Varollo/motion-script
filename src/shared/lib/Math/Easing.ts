import { MSMath } from './MSMath';
/**
 * Here are some easing functions based on this repo: https://github.com/danro/jquery-easing/blob/master/jquery.easing.js by Dan Rogers
 */
export namespace Easing{

    /**
     * @interface EasingOptions refers to common options for easing functions
     * @param k moment in time
     * @param s start value
     * @param e end value
     * @param d duration of ease
     * @param a time of action
     * @param h threshold to change ease from in to out (should be from 0 to 1, but if necessary, set c to false to allow unclamped threshold)
     * @param c should the threshold be clamped to a value between 0 and 1?
     * @param f fallback function for when ease goes harde
     */
    export interface EasingOptions{
        k: number,
        s: number,
        e: number,
        d: number,
        h?: number,
    }

    /**
     * @interface EasingFunction refers to declaration of easing functions
     * @param k moment in time
     * @param s start value
     * @param e end value
     * @param d duration of ease
     * @param h threshold to change ease from in to out (should be from 0 to 1, but if necessary, set c to false to allow unclamped threshold)
     */
    interface EasingFunction {({ k, s, e, d, h }: EasingOptions) : number}

    /**
     * @interface Ease refers to a pair of ease in and out functions
     */
    interface Ease { easeIn: EasingFunction, easeOut: EasingFunction, easeInP: EasingFunction, easeOutP: EasingFunction }

    const easingFunctions : { linear: Ease, quadratic: Ease, cubic: Ease, /*bounce: Ease*/ } = {
        linear: {
            easeIn:   ({ k, s, e, d }:  EasingOptions): number => (e - s) * (k / d) + s,
            easeOut:  ({ k, s, e, d }:  EasingOptions): number => (e - s) * (k / d) + s,
            easeInP:  ({ k, s, e, h }:  EasingOptions): number => (e - s) * h * k + s,
            easeOutP: ({ k, s, e, h }:  EasingOptions): number => (e - s) * (1 - h) * k + s,
        },

        quadratic: {
            easeIn:   ({ k, s, e, d }:  EasingOptions): number => (e - s) * (k /= d) * k + s,
            easeOut:  ({ k, s, e, d }:  EasingOptions): number => (s - e) * (k /= d) * (k - 2) + s,
            easeInP:  ({ k, s, e, h }:  EasingOptions): number => (e - s) * h * k * k + s,
            easeOutP: ({ k, s, e, h }:  EasingOptions): number => (s - e) * (1 - h) * (--k * (k - 2) - 1) + s,
        },

        cubic: {
            easeIn:   ({ k, s, e, d, }: EasingOptions): number => (e - s) * (k /= d) * k * k + s,
            easeOut:  ({ k, s, e, d, }: EasingOptions): number => (e - s) * ((k = k / d - 1) * k * k + 1) + s,
            easeInP:  ({ k, s, e, h }:  EasingOptions): number => (e - s) * h * k * k * k + s,
            easeOutP: ({ k, s, e, h }:  EasingOptions): number => (e - s) * (1 - h) * ((k -= 2) * k * k + 2) + s,
        },
        // bounce: {
        //     easeIn:   ({ k, s, e, d, h }:  EasingOptions): number => (k*= d / h) * 0 + (e - s) - easingFunctions.bounce.easeOut({ k: d-k, s:0, e: e-s, d }) + s,
        //     easeOut:  ({ k, s, e, d, h }:  EasingOptions): number => {    
        //         k*= d / h            
        //         if ((k/=d) < (1/2.75))   return (e - s) * (7.5625*k*k) + k;
        //         else if (k < (2/2.75))   return (e - s) * (7.5625*(k-=(1.5/2.75))*k + .75) + s;
        //         else if (k < (2.5/2.75)) return (e - s) * (7.5625*(k-=(2.25/2.75))*k + .9375) + s;
        //         else                     return (e - s) * (7.5625*(k-=(2.625/2.75))*k + .984375) + s;
        //     },
        //     easeInP:  ({ k, s, e, d, h }:  EasingOptions): number => (k*= d / h) * 0 + easingFunctions.bounce.easeIn( { k: k/h, s: 0, e: e-s, d: d } ) * h + s,
        //     easeOutP: ({ k, s, e, d, h }:  EasingOptions): number => (k*= d / h) * 0 + easingFunctions.bounce.easeOut( { k: (k/h)-d, s: 0, e: e-s, d: d } ) * h + (e - s) * h + s,
        // }
    }

    export const EasingFunctions = {
        linear:    Object.keys(easingFunctions)[0],
        quadratic: Object.keys(easingFunctions)[1],
        cubic:     Object.keys(easingFunctions)[2],
        // bounce:    Object.keys(easingFunctions)[3],
    }

    /**
     * @param  {number}          [k]           moment in time
     * @param  {number}          [s]           start value
     * @param  {number}          [e]           end value
     * @param  {number}          [d]           ease duration
     * @param  {number}          [h=0.5]       threshold to switch from easeIn to easeOut
     * @param  {EasingFunctions} [easeIn]      ease before threshold
     * @param  {EasingFunctions} [easeOut]     ease after threshold
     * @param  {boolean}         [clampH=true] should we clamp the threshold to a value between 0 and 1?
     * @param  {boolean}         [clampK=true] should we clamp K to the duration? (this will also stop the easing calculation)
     * @return {number} 
     */
    export function easeInOut({ k, s, e, d, h = 0.5 }: EasingOptions, easeIn: string = EasingFunctions.linear, easeOut: string = EasingFunctions.linear, clampK = true, clampH = true): number{        
        k = clampK ? MSMath.clamp(k, 0, d) : k;
        h = clampH ? MSMath.clamp(h) : h;  
              
        if(clampK && k == d)
            return e;

        else if((k /= d * h) < 1)
            return easingFunctions[easeIn].easeInP   ({ k, s, e, d, h });

        else                
            return easingFunctions[easeOut].easeOutP ({ k, s, e, d, h });
    }

    /**
     * @param {number}          [k]           moment in time
     * @param {number}          [s]           start value
     * @param {number}          [e]           end value
     * @param {number}          [d]           ease duration
     * @param {EasingFunctions} [ease]        ease
     * @param  {boolean}         [clampK=true] should we clamp K to the duration? (this will also stop the easing calculation)
     * @return {number} 
     */
    export function easeIn({ k, s, e, d }: EasingOptions, ease: string = EasingFunctions.linear, clampK = true): number{     
        k = clampK ? MSMath.clamp(k, 0, d) : k;     
        
        if(clampK && k == d)
            return e;

        else
            return easingFunctions[ease].easeIn ({ k, s, e, d });
    }

    /**
     * @param {number}          [k]           moment in time
     * @param {number}          [s]           start value
     * @param {number}          [e]           end value
     * @param {number}          [d]           ease duration
     * @param {EasingFunctions} [ease]        ease
     * @param  {boolean}         [clampK=true] should we clamp K to the duration? (this will also stop the easing calculation)
     * @return {number} 
     */
     export function easeOut({ k, s, e, d }: EasingOptions, ease: string = EasingFunctions.linear, clampK = true): number{     
        k = clampK ? MSMath.clamp(k, 0, d) : k;        
        
        if(clampK && k == d)
            return e;

        else
            return easingFunctions[ease].easeOut ({ k, s, e, d });
    }
}