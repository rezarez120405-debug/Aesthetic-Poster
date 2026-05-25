import { 
  AspectRatioConfig, 
  LayoutPresetConfig, 
  FontConfig, 
  ColorPalette, 
  QuotePreset 
} from './types';

export const ASPECT_RATIOS: AspectRatioConfig[] = [
  { id: 'square', name: 'Instagram Feed (1:1)', width: 1080, height: 1080, ratio: 1, icon: 'Square' },
  { id: 'portrait', name: 'Portrait Feed (4:5)', width: 1080, height: 1350, ratio: 0.8, icon: 'FileText' },
  { id: 'story', name: 'Instagram Story (9:16)', width: 1080, height: 1920, ratio: 0.5625, icon: 'Smartphone' },
];

export const LAYOUT_PRESETS: LayoutPresetConfig[] = [
  {
    id: 'minimalist',
    name: 'Modern Minimalist',
    description: 'Clean design with thin margins, high-contrast, quiet elegance.',
  },
  {
    id: 'editorial',
    name: 'Swiss Editorial',
    description: 'Asymmetric grid, bold sans-serif, inspired by modern design books.',
  },
  {
    id: 'poetry',
    name: 'Classic Poetry',
    description: 'Delicate serif, ample negative space, timeless literary look.',
  },
  {
    id: 'brutalist',
    name: 'Brutalist / Tech',
    description: 'Monospace, uppercase metadata, raw lines, structural vibes.',
  },
  {
    id: 'bold-statement',
    name: 'Bold Statement',
    description: 'Giant display font, expressive lettering, minimal extra details.',
  },
];

export const FONTS: FontConfig[] = [
  // Serifs
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif", category: 'serif' },
  { id: 'garamond', name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif", category: 'serif' },
  { id: 'fraunces', name: 'Fraunces', family: "'Fraunces', serif", category: 'serif' },
  { id: 'italiana', name: 'Italiana', family: "'Italiana', serif", category: 'serif' },
  { id: 'cinzel', name: 'Cinzel', family: "'Cinzel', serif", category: 'serif' },
  
  // Sans-Serif
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif", category: 'sans-serif' },
  { id: 'space-grotesk', name: 'Space Grotesk', family: "'Space Grotesk', sans-serif", category: 'display' },
  { id: 'syne', name: 'Syne', family: "'Syne', sans-serif", category: 'display' },
  { id: 'outfit', name: 'Outfit', family: "'Outfit', sans-serif", category: 'sans-serif' },
  
  // Monospace
  { id: 'jetbrains', name: 'JetBrains Mono', family: "'JetBrains Mono', monospace", category: 'monospace' },
  { id: 'fira-code', name: 'Fira Code', family: "'Fira Code', monospace", category: 'monospace' },
];

export const SOLID_PALETTES: ColorPalette[] = [
  {
    name: 'Vanilla Cream',
    textColor: '#1A1A1A',
    bgColor: '#FDFBF7',
    borderColor: '#E6DFD3',
    badgeColor: '#EBE4D5'
  },
  {
    name: 'Sage Whisper',
    textColor: '#1B3022',
    bgColor: '#E1E8E2',
    borderColor: '#C3D0C6',
    badgeColor: '#CBD7CE'
  },
  {
    name: 'Terracotta Warmth',
    textColor: '#2E150F',
    bgColor: '#F5ECE6',
    borderColor: '#EBC7B9',
    badgeColor: '#DF9B81'
  },
  {
    name: 'Earthy Clay',
    textColor: '#FFFFFF',
    bgColor: '#C26D50',
    borderColor: '#D48C74',
    badgeColor: '#7D3B25'
  },
  {
    name: 'Midnight Ash',
    textColor: '#F5F5F5',
    bgColor: '#121212',
    borderColor: '#2D2D2D',
    badgeColor: '#202020'
  },
  {
    name: 'Royal Olive',
    textColor: '#FDFDFD',
    bgColor: '#2E352C',
    borderColor: '#4A5348',
    badgeColor: '#3D463B'
  },
  {
    name: 'Muted Lavender',
    textColor: '#3A3147',
    bgColor: '#EDE6F2',
    borderColor: '#D0C1DD',
    badgeColor: '#DACFE6'
  },
  {
    name: 'Swiss Brut',
    textColor: '#000000',
    bgColor: '#FFFFFF',
    borderColor: '#000000',
    badgeColor: '#E5E5E5'
  },
  {
    name: 'Deep Forest',
    textColor: '#E8F5E9',
    bgColor: '#1B5E20',
    borderColor: '#2E7D32',
    badgeColor: '#388E3C'
  },
  {
    name: 'Cosmic Indigo',
    textColor: '#E8EAF6',
    bgColor: '#1A237E',
    borderColor: '#283593',
    badgeColor: '#303F9F'
  }
];

export const GRADIENT_PALETTES: ColorPalette[] = [
  {
    name: 'Sunrise Serenade',
    textColor: '#2D1630',
    bgColor: '#FFE3E3',
    borderColor: '#FFD1D1',
    badgeColor: '#FFDEDE',
    isGradient: true,
    gradient: {
      type: 'linear',
      colors: ['#FFECD2', '#FCB69F'],
      angle: 135
    }
  },
  {
    name: 'Cyber Neon',
    textColor: '#FFFFFF',
    bgColor: '#1A0B2E',
    borderColor: '#3D1563',
    badgeColor: '#280A48',
    isGradient: true,
    gradient: {
      type: 'linear',
      colors: ['#1A0B2E', '#2B0F54', '#10061E'],
      angle: 180
    }
  },
  {
    name: 'Sweet Lavender',
    textColor: '#2E224F',
    bgColor: '#F1EEF9',
    borderColor: '#ECE5F6',
    badgeColor: '#ECE7F5',
    isGradient: true,
    gradient: {
      type: 'linear',
      colors: ['#E0C3FC', '#8EC5FC'],
      angle: 120
    }
  },
  {
    name: 'Pistachio Matcha',
    textColor: '#22381F',
    bgColor: '#E3F2CE',
    borderColor: '#CFE6B4',
    badgeColor: '#EBF4DD',
    isGradient: true,
    gradient: {
      type: 'linear',
      colors: ['#D4FC79', '#96E6A1'],
      angle: 45
    }
  },
  {
    name: 'Mystic Aura',
    textColor: '#FFFFFF',
    bgColor: '#111827',
    borderColor: '#4F46E5',
    badgeColor: '#312E81',
    isGradient: true,
    gradient: {
      type: 'radial',
      colors: ['#312E81', '#111827'],
      angle: 0
    }
  },
  {
    name: 'Warm Sunset',
    textColor: '#3C1318',
    bgColor: '#FDF0CD',
    borderColor: '#FEDCA0',
    badgeColor: '#FDF1CE',
    isGradient: true,
    gradient: {
      type: 'linear',
      colors: ['#FAD961', '#F76B1C'],
      angle: 90
    }
  },
  {
    name: 'Arctic Frost',
    textColor: '#0B2D3F',
    bgColor: '#E1F5FE',
    borderColor: '#B3E5FC',
    badgeColor: '#E3F2FD',
    isGradient: true,
    gradient: {
      type: 'linear',
      colors: ['#A1C4FD', '#C2E9FB'],
      angle: 135
    }
  },
  {
    name: 'Sandalwood Dream',
    textColor: '#3A2E2B',
    bgColor: '#FAEDE3',
    borderColor: '#E8D5C8',
    badgeColor: '#F6E6DB',
    isGradient: true,
    gradient: {
      type: 'linear',
      colors: ['#E6D4CB', '#FFF3EB', '#DCD0C7'],
      angle: 45
    }
  }
];

export const QUOTE_PRESETS: QuotePreset[] = [
  // Indonesian Quotes
  {
    text: "Hiduplah seolah kamu akan mati besok. Belajarlah seolah kamu akan hidup selamanya.",
    author: "Mahatma Gandhi",
    category: "Kehidupan"
  },
  {
    text: "Seni adalah dusta yang membuat kita menyadari kebenaran.",
    author: "Pablo Picasso",
    category: "Seni & Kreativitas"
  },
  {
    text: "Jangan tanyakan apa yang dunia butuhkan. Tanyakan apa yang membuatmu hidup, lalu lakukanlah.",
    author: "Howard Thurman",
    category: "Inspirasi"
  },
  {
    text: "Bunga yang mekar dalam kesulitan adalah yang paling langka dan paling indah dari semuanya.",
    author: "Mulan",
    category: "Kehidupan"
  },
  {
    text: "Kesempatan seringkali menyamar sebagai kerja keras, sehingga banyak orang tidak mengenalinya.",
    author: "Thomas Edison",
    category: "Kerja Keras"
  },
  {
    text: "Bila kau cemas akan masa depan, kau melewatkan saat ini. Padahal saat ini adalah satu-satunya milikmu.",
    author: "Anonim",
    category: "Kesadaran diri"
  },
  {
    text: "Kesunyian adalah tempat terbaik bagi pikiran untuk merajut mimpi-mimpi baru.",
    author: "Pramoedya Ananta Toer",
    category: "Sastra"
  },
  {
    text: "Kita tidak berhenti bermain karena kita tumbuh tua; kita tumbuh tua karena kita berhenti bermain.",
    author: "George Bernard Shaw",
    category: "Filosofi"
  },
  {
    text: "Segala sesuatu memiliki keindahan, tetapi tidak semua orang bisa melihatnya.",
    author: "Konfusius",
    category: "Keindahan"
  },
  
  // English Quotes
  {
    text: "The details are not the details. They make the design.",
    author: "Charles Eames",
    category: "Seni & Kreativitas"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "Inspirasi"
  },
  {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    category: "Minimalis"
  },
  {
    text: "To create is to destroy standard expectations.",
    author: "Aesthetic Core",
    category: "Seni & Kreativitas"
  },
  {
    text: "The creative adult is the child who survived.",
    author: "Ursula K. Le Guin",
    category: "Inspirasi"
  },
  {
    text: "Quiet rooms speak the loudest words of typography.",
    author: "Swiss Design Lore",
    category: "Minimalis"
  },
  {
    text: "What you seek is seeking you.",
    author: "Rumi",
    category: "Poetry"
  },
  {
    text: "The sun is new each day.",
    author: "Heraclitus",
    category: "Poetry"
  }
];
