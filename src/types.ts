export type AspectRatio = 'square' | 'portrait' | 'story';

export interface AspectRatioConfig {
  id: AspectRatio;
  name: string;
  width: number; // base render width
  height: number; // base render height
  ratio: number; // numeric ratio
  icon: string;
}

export type LayoutPreset = 'minimalist' | 'editorial' | 'brutalist' | 'poetry' | 'bold-statement';

export interface LayoutPresetConfig {
  id: LayoutPreset;
  name: string;
  description: string;
}

export type BorderStyle = 'none' | 'thin' | 'thick' | 'double' | 'brackets' | 'art-deco';

export type QuoteIconStyle = 'none' | 'serif' | 'modern' | 'clean' | 'curly';

export interface GradientConfig {
  type: 'linear' | 'radial' | 'mesh';
  colors: string[];
  angle: number;
}

export interface DesignState {
  text: string;
  author: string;
  aspectRatio: AspectRatio;
  
  // Background config
  bgType: 'solid' | 'gradient' | 'image';
  bgColor: string;
  bgGradient: GradientConfig;
  bgImageSrc: string | null;
  bgImageOpacity: number;
  bgImageBlur: number;
  
  // Typography config
  fontFamily: string;
  fontWeight: string; // 'normal' | 'bold'
  fontStyle: string; // 'normal' | 'italic'
  textTransform: 'none' | 'uppercase' | 'lowercase';
  fontSize: number; // scaling factor, e.g. 1.0 (relative to theme base)
  textColor: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  letterSpacing: number; // in px or em
  lineHeight: number; // e.g. 1.2 to 2.0
  
  // Structural Design Preset
  layoutPreset: LayoutPreset;
  
  // Overlay / Aesthetic details
  grainOpacity: number; // 0 to 1 (visual texture overlay)
  borderStyle: BorderStyle;
  borderColor: string;
  borderWidth: number; // size scaling factor
  
  // Quote Mark Elements
  quoteIconStyle: QuoteIconStyle;
  quoteIconColor: string;
  quoteIconOpacity: number;
  quoteIconSize: number; // scale
  
  // Badges & Metadata
  badgeText: string; // extra metadata element, e.g. "POSTER SERIES NO. 01 // VOL. I"
  badgeColor: string;
  showDate: boolean;
  watermarkText: string; // e.g. "@my_instagram"
  watermarkColor: string;
  
  // Noise / Grain settings
  grainColor: 'dark' | 'light';
}

export interface ColorPalette {
  name: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
  isGradient?: boolean;
  gradient?: GradientConfig;
}

export interface FontConfig {
  id: string;
  name: string;
  family: string;
  category: 'serif' | 'sans-serif' | 'display' | 'monospace';
}

export interface QuotePreset {
  text: string;
  author: string;
  category: string;
}
