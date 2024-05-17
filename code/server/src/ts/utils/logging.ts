import { ColorWrap, LogColor } from '@notespace/shared/src/utils/logging';

export const ServiceLogCaller = {
  Server: ColorWrap(LogColor.Blue, 'Server'),
  Database: ColorWrap(LogColor.Green, 'Database'),
  Services: ColorWrap(LogColor.Yellow, 'Services'),
  Controllers: ColorWrap(LogColor.Red, 'Controllers'),
};
