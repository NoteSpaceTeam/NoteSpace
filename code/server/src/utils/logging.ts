import { ColorWrap, LogColor } from '@notespace/shared/src/utils/logging';
import getLogger from '@notespace/shared/src/utils/logging';

export const Loggers = {
  Server: ColorWrap(LogColor.Blue, 'Server'),
  Database: ColorWrap(LogColor.Green, 'Database'),
  Services: ColorWrap(LogColor.Yellow, 'Services'),
  Controllers: ColorWrap(LogColor.Red, 'Controllers'),
  Error: ColorWrap(LogColor.Red, 'Error'),
};

export const ServerLogger = getLogger(Loggers.Server);
export const DatabaseLogger = (module: string) => getLogger(Loggers.Database + '-' + ColorWrap(LogColor.Green, module));
export const ServicesLogger = (module: string) =>
  getLogger(Loggers.Services + '-' + ColorWrap(LogColor.Yellow, module));
export const ControllersLogger = (module: string) =>
  getLogger(Loggers.Controllers + '-' + ColorWrap(LogColor.Red, module));
export const ErrorLogger = getLogger(Loggers.Error);
