export interface BannerSize {
  name: string;
  width: number;
  height: number;
  label: string;
}

export interface AdColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  buttonText: string;
}

export interface AdCopy {
  headline: string;
  subheadline: string;
  cta: string;
  imagePrompt: string;
  colors: AdColors;
}

export interface GeneratedAd {
  copy: AdCopy;
  imageBase64: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING_COPY = 'GENERATING_COPY',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}