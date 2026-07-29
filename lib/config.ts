import configData from "@/data/config.json";

export interface AppConfig {
  appName: string;
  tagline: string;
  description: string;
  drawCta: string;
  drawAgainCta: string;
  aboutCta: string;
  homeCta: string;
  sharePrefix: string;
  shareSource: string;
}

export const config = configData as AppConfig;
