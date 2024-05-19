import { ColorWrap, LogColor } from '@notespace/shared/src/utils/logging';
import getLogger from '@notespace/shared/src/utils/logging';

export const ClientLogCaller = {
  React: ColorWrap(LogColor.Blue, 'React'),
  Services: ColorWrap(LogColor.Yellow, 'Services'),
  Domain: ColorWrap(LogColor.Green, 'Domain'),
  PWA: ColorWrap(LogColor.Red, 'PWA'),
};

export const DomainLogCaller = getLogger(ClientLogCaller.Domain);
export const ServicesLogCaller = getLogger(ClientLogCaller.Services);
export const ReactLogCaller = getLogger(ClientLogCaller.React);
export const PWALogCaller = getLogger(ClientLogCaller.PWA);