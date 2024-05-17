import {ColorWrap, LogColor} from '@notespace/shared/src/utils/logging';


export const ClientLogCaller = {
    React: ColorWrap(LogColor.Blue, 'React'),
    Services: ColorWrap(LogColor.Yellow, 'Services'),
    Domain: ColorWrap(LogColor.Green, 'Domain'),
    PWA: ColorWrap(LogColor.Red, 'PWA'),
}