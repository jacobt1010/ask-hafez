import configData from "@/data/config.json";

export interface AppConfig {
  appName: string;
  tagline: string;
  description: string;
  drawCta: string;
  drawAgainCta: string;
  aboutCta: string;
  pauseTitle: string;
  pauseBody: string;
  revealCta: string;
  homeCta: string;
  sharePrefix: string;
  shareSource: string;
}

export const config = configData as AppConfig;
