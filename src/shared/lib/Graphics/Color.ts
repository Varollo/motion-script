import { Debugger } from '../Debug/Debugger.js';

export class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(r: number = 1, g: number = 1, b: number = 1, a: number = 1.0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public static hex2Rgba(colorHex: string): string {
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(colorHex)) {
            c = colorHex.substring(1).split('');

            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }

            c = '0x' + c.join('');

            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
        }

        throw Debugger.error(`Couldn't parse provided hexadecimal: \"${colorHex}\".`, "Color", new SyntaxError());
    }

    public static get black() : Color { return new Color(0,0,0,255); }

    public toString(): string {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }

    public static FromString(color: string) : Color{      
        try{
            const rgb = color.replace(/[^\d,]/g, '').split(',');
            const c = new Color();
            
            c.r = parseFloat(rgb[0]);
            c.g = parseFloat(rgb[1]);
            c.b = parseFloat(rgb[2]);
            if(rgb.length > 3) c.a = parseFloat(rgb[3]);
        }        
        catch{
            try{
                return this.FromString(this.hex2Rgba(color));
            }
            catch{
                try{
                    return this[color];
                }
                catch{
                    Debugger.error(`Unsupported color syntax: \"${color}\".`, "Color", new SyntaxError);
                }
            }
        }
    }
}
