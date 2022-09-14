export namespace Debugger{
    export enum LogType
    {
        Log = "Log",
        Warning = "Warning",
        Error = "Error",
    }

    const formatters = {
        Log: (msg: string, sender: string) => `[ MotionScript${ sender } ] ${ msg }`,
        Warning: (msg: string, sender: string) => `[ MotionScript${ sender } Warning! ] ${ msg }`,
        Error: (msg: string, sender: string) => `[ MotionScript${ sender } ERROR!!! ] ${ msg }`
    }    
    
    const loggers = {
        Log: (msg: string, sender: string) => console.log(formatters.Log(msg, sender)),
        Warning: (msg: string, sender: string) => console.warn(formatters.Warning(msg, sender)),
        Error: (msg: string, sender: string) => console.error(formatters.Error(msg, sender))
    }

    export const log = (message: any, sender: string | null = null, logType = LogType.Log) : string => {
        const logger = (loggers[logType.toString()] as Function);
        return logger(formatters[logType.toString()](message, sender && sender.length != 0 ? `:${sender}` : ""));
    }

    export const error = (msg: string | null = null, sender: string | null = null, error: Error | null): Error => {
        const e = error ?? new Error();
        e.message = formatters.Error(msg ?? e.message, sender && sender.length != 0 ? `:${sender}` : "");
        return e;
    }
}