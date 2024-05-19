import { ColorWrap, LogColor } from '@notespace/shared/src/utils/logging';
import getLogger from '@notespace/shared/src/utils/logging';

export const ServiceLogCaller = {
  Server: ColorWrap(LogColor.Blue, 'Server'),
  Database: ColorWrap(LogColor.Green, 'Database'),
  Services: ColorWrap(LogColor.Yellow, 'Services'),
  Controllers: ColorWrap(LogColor.Red, 'Controllers'),
};

export const ServerLogCaller = getLogger(ServiceLogCaller.Server);
export const DatabaseLogCaller = (module: string) =>
  getLogger(ServiceLogCaller.Database + '-' + ColorWrap(LogColor.Green, module));
export const ServicesLogCaller = (module: string) =>
  getLogger(ServiceLogCaller.Services + '-' + ColorWrap(LogColor.Yellow, module));
export const ControllersLogCaller = (module: string) =>
  getLogger(ServiceLogCaller.Controllers + '-' + ColorWrap(LogColor.Red, module));
