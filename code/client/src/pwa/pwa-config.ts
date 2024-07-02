import { VitePWAOptions } from 'vite-plugin-pwa';
import {manifestConfig} from "./manifest-config";

const pwaConfig: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  manifest: manifestConfig,
  devOptions: {
    enabled: true,
  }
};
export default pwaConfig;
