export enum LogColor {
    Red = '\x1b[31m',
    Green = '\x1b[32m',
    Yellow = '\x1b[33m',
    Blue = '\x1b[34m',
    Reset = '\x1b[0m',
}

export const ColorWrap = (color : LogColor, message: string) => color + message + LogColor.Reset;

const colorLog = (caller : string, message : string, color : LogColor) =>
    log(caller, color + message + LogColor.Reset);

const log = (caller : string, message : string) => console.log(`[${caller}] ${message}`);

const logWarning = (caller : string, message : string, ) =>
    colorLog(caller, "⚠ " + message, LogColor.Yellow);

const logError = (caller : string, message : string) =>
    colorLog(caller, "✖ " + message, LogColor.Red);

const logSuccess = (caller : string, message : string) =>
    colorLog(caller, "✔ " + message, LogColor.Green);

const logInfo = (caller : string, message : string) =>
    colorLog(caller,"🛈" + message, LogColor.Blue);

const logLine = () => console.log('----------------------------------------');

export default (caller : string) => ({
    log: (message : string) => log(caller, message),
    logWarning: (message : string) => logWarning(caller, message),
    logError: (message : string) => logError(caller, message),
    logSuccess: (message : string) => logSuccess(caller, message),
    logInfo: (message : string) => logInfo(caller, message),
    logLine : () => logLine(),
});