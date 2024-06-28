import { ColorWrap, LogColor } from '@notespace/shared/src/utils/logging';
import getLogger from '@notespace/shared/src/utils/logging';

const Loggers = {
  Server: ColorWrap(LogColor.Blue, 'Server'),
  Database: ColorWrap(LogColor.Green, 'Database'),
  Services: ColorWrap(LogColor.Yellow, 'Services'),
  Controllers: ColorWrap(LogColor.Red, 'Controllers'),
  Error: ColorWrap(LogColor.Red, 'Error'),
};

export const ServerLogger = getLogger(Loggers.Server);
export const ControllersLogger = (module: string) =>
  getLogger(Loggers.Controllers + '-' + ColorWrap(LogColor.Red, module));
export const ErrorLogger = getLogger(Loggers.Error);
