export namespace MSMath{
        export const clamp = (v: number, v0: number = 0, v1: number = 1) => Math.max(v0,Math.min(v,v1));
}