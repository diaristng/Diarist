import { BannerSize } from './types';

export const BANNER_SIZES: BannerSize[] = [
  { name: 'medium-rectangle', width: 300, height: 250, label: 'Medium Rectangle (300x250)' },
  { name: 'leaderboard', width: 728, height: 90, label: 'Leaderboard (728x90)' },
  { name: 'wide-skyscraper', width: 160, height: 600, label: 'Wide Skyscraper (160x600)' },
  { name: 'mobile-leaderboard', width: 320, height: 50, label: 'Mobile Leaderboard (320x50)' },
  { name: 'half-page', width: 300, height: 600, label: 'Half Page (300x600)' },
  { name: 'large-rectangle', width: 336, height: 280, label: 'Large Rectangle (336x280)' },
];

export const MOCK_IMAGE = "https://picsum.photos/1024/1024";

export const SAMPLE_PROMPTS = [
  { desc: "Eco-friendly bamboo toothbrush with charcoal bristles", url: "pureearth.com" },
  { desc: "High-performance gaming headset with noise cancellation", url: "audiogear.tech" },
  { desc: "Organic matcha tea powder from Kyoto, ceremonial grade", url: "zenmatcha.co" },
];