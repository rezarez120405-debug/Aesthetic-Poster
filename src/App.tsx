import { useState } from 'react';
import { DesignState, AspectRatio } from './types';
import { SOLID_PALETTES, GRADIENT_PALETTES, QUOTE_PRESETS, FONTS } from './data';
import PosterPreview from './components/PosterPreview';
import Toolbar from './components/Toolbar';
import { renderPosterToCanvas } from './utils/canvasRenderer';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle, 
  RefreshCw, 
  Info,
  Layers,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Elegant default beginning state for the app
const INITIAL_STATE: DesignState = {
  text: "Hiduplah seolah kamu akan mati besok. Belajarlah seolah kamu akan hidup selamanya.",
  author: "Mahatma Gandhi",
  aspectRatio: 'square',
  
  // Background
  bgType: 'solid',
  bgColor: '#FDFBF7',
  bgGradient: { type: 'linear', colors: ['#E6D4CB', '#FFF3EB'], angle: 135 },
  bgImageSrc: null,
  bgImageOpacity: 0.8,
  bgImageBlur: 3,
  
  // Typography
  fontFamily: "'Playfair Display', serif",
  fontWeight: 'normal',
  fontStyle: 'normal',
  textTransform: 'none',
  fontSize: 1.0,
  textColor: '#1A1A1A',
  textAlign: 'center',
  letterSpacing: 0,
  lineHeight: 1.6,
  
  // Styling Preset
  layoutPreset: 'poetry',
  
  // Overlays
  grainOpacity: 0.08,
  borderStyle: 'brackets',
  borderColor: '#E6DFD3',
  borderWidth: 1.2,
  
  // Quote Marks
  quoteIconStyle: 'curly',
  quoteIconColor: '#C26D50',
  quoteIconOpacity: 0.4,
  quoteIconSize: 1.0,
  
  // Metadata & watermarks
  badgeText: 'DAILY WISDOM',
  badgeColor: '#EBE4D5',
  showDate: true,
  watermarkText: '@rezarez120405',
  watermarkColor: 'rgba(26,26,26,0.35)',
  grainColor: 'dark'
};

export default function App() {
  const [designState, setDesignState] = useState<DesignState>(INITIAL_STATE);
  
  // Toast notifications manager state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Automated design generator/randomizer to trigger creative flow
  const handleRandomize = () => {
    try {
      // Pick random quote
      const quote = QUOTE_PRESETS[Math.floor(Math.random() * QUOTE_PRESETS.length)];
      
      // Pick solid or gradient palettes
      const useGradient = Math.random() > 0.45;
      const paletteCollection = useGradient ? GRADIENT_PALETTES : SOLID_PALETTES;
      const palette = paletteCollection[Math.floor(Math.random() * paletteCollection.length)];
      
      // Dynamic structures
      const presets: ('minimalist' | 'poetry' | 'editorial' | 'brutalist' | 'bold-statement')[] = [
        'minimalist', 'poetry', 'editorial', 'brutalist', 'bold-statement'
      ];
      const randomPreset = presets[Math.floor(Math.random() * presets.length)];
      
      // Modify state preserving layout changes
      setDesignState(prev => {
        const next = { ...prev };
        next.text = quote.text;
        next.author = quote.author;
        next.layoutPreset = randomPreset;
        next.textColor = palette.textColor;
        next.borderColor = palette.borderColor;
        next.badgeColor = palette.badgeColor;
        
        if (palette.isGradient && palette.gradient) {
          next.bgType = 'gradient';
          next.bgGradient = palette.gradient;
        } else {
          next.bgType = 'solid';
          next.bgColor = palette.bgColor;
        }

        // Apply customized font families matching target style characters
        if (randomPreset === 'poetry') {
          next.fontFamily = "'Cormorant Garamond', serif";
          next.borderStyle = 'brackets';
          next.fontWeight = 'normal';
          next.fontStyle = 'italic';
          next.quoteIconStyle = 'curly';
          next.quoteIconColor = palette.isGradient ? '#FFFFFF' : '#C26D50';
          next.textAlign = 'center';
          next.textTransform = 'none';
        } else if (randomPreset === 'editorial') {
          next.fontFamily = "'Space Grotesk', sans-serif";
          next.borderStyle = 'none';
          next.fontWeight = 'bold';
          next.fontStyle = 'normal';
          next.quoteIconStyle = 'serif';
          next.textAlign = 'left';
          next.textTransform = 'uppercase';
        } else if (randomPreset === 'brutalist') {
          next.fontFamily = "'JetBrains Mono', monospace";
          next.borderStyle = 'double';
          next.fontWeight = 'bold';
          next.quoteIconStyle = 'modern';
          next.textAlign = 'left';
          next.textTransform = 'uppercase';
        } else if (randomPreset === 'bold-statement') {
          next.fontFamily = "'Syne', sans-serif";
          next.borderStyle = 'none';
          next.fontWeight = 'bold';
          next.quoteIconStyle = 'none';
          next.textAlign = 'center';
          next.textTransform = 'uppercase';
        } else {
          // minimalist
          next.fontFamily = "'Inter', sans-serif";
          next.borderStyle = 'none';
          next.fontWeight = 'normal';
          next.quoteIconStyle = 'none';
          next.textAlign = 'center';
          next.textTransform = 'none';
        }
        
        return next;
      });

      showToast("Berhasil meramu desain estetik acak!", 'success');
    } catch (e) {
      showToast("Gagal melakukan acak.", 'error');
    }
  };

  // High-Resolution Export Handler triggers client-side saving
  const handleDownload = async (format: 'png' | 'jpeg') => {
    showToast("Mempersiapkan gambar resolusi tinggi...", 'info');
    
    try {
      // Draw canvas at full high-resolution (e.g. 2048 x 2560 pixels)
      const highResCanvas = await renderPosterToCanvas(designState);
      
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const extension = format === 'png' ? 'png' : 'jpg';
      
      const dataUrl = highResCanvas.toDataURL(mimeType, 0.95);
      
      // Native browser dynamic download link
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      
      const safeAuthor = designState.author
        .toLowerCase()
        .replace(/[^a-z0-0]/g, '_')
        .slice(0, 15) || 'design';
      const safeAspect = designState.aspectRatio;
      
      downloadLink.download = `aesthetic_quote_${safeAuthor}_${safeAspect}.${extension}`;
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      showToast(`Poster disimpan dalam format ${format.toUpperCase()} resolusi tinggi!`, 'success');
    } catch (err: any) {
      console.error('Export Error:', err);
      showToast(`Macet sewaktu mengunduh poster: ${err.message || err}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-neutral-100 flex flex-col font-sans selection:bg-[#FF4F00] selection:text-white">
      
      {/* Dynamic Toast Notifications Popup Overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded border font-sans text-xs font-bold shadow-2xl backdrop-blur-md max-w-sm w-full outline outline-1 outline-white/10"
            style={{
              backgroundColor: toastMessage.type === 'error' ? 'rgba(76, 29, 29, 0.95)' : toastMessage.type === 'info' ? 'rgba(22, 22, 22, 0.95)' : 'rgba(22, 22, 22, 0.95)',
              borderColor: toastMessage.type === 'error' ? '#EF4444' : toastMessage.type === 'info' ? '#3B82F6' : '#FF4F00'
            }}
          >
            {toastMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-[#FF4F00] shrink-0" />}
            {toastMessage.type === 'error' && <Info className="w-4 h-4 text-rose-400 shrink-0" />}
            {toastMessage.type === 'info' && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />}
            
            <span className="text-neutral-200 tracking-wide">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid Workspace Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        
        {/* Top Minimal Branding Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-b border-[#2A2A2A] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[9px] font-bold font-mono tracking-[0.25em] bg-[#FF4F00]/10 text-[#FF4F00] border border-[#FF4F00]/20 uppercase">
                STUDIO / POSTER GEN
              </span>
              <span className="text-[10px] text-neutral-500 font-bold tracking-wider font-mono">V1.5 (SECURE LOCAL ENGINE)</span>
            </div>
            
            <h1 className="text-xl font-bold font-sans tracking-[0.1em] text-white uppercase flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#FF4F00]" />
              Aesthetic Quote Poster Maker
            </h1>
            
            <p className="text-xs text-neutral-400 max-w-xl font-sans">
              Rancang kutipan kata estetik menjadi poster grafis Instagram dengan visual modern, filter grain, aksen frame, dan unduhan kualitas Ultra-HD secara instan.
            </p>
          </div>

          {/* Quick random action button & source labels */}
          <div className="flex gap-2 w-full sm:w-auto shrink-0">
            <button
              id="btn-random-combo"
              onClick={handleRandomize}
              className="flex items-center justify-center gap-2 bg-[#161616] border border-[#2A2A2A] hover:border-[#333] hover:bg-[#222] text-neutral-200 hover:text-white px-5 py-2.5 rounded text-xs font-bold transition-all duration-200 flex-1 sm:flex-none min-h-[44px] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[#FF4F00]" />
              <span className="tracking-wider uppercase text-[10px]">Gabungan Acak</span>
            </button>
            
            <div className="hidden md:flex items-center bg-[#161616] rounded px-4 py-2.5 border border-[#2A2A2A] text-[10px] text-neutral-400 gap-2 font-mono tracking-wider">
              <Info className="w-3.5 h-3.5 text-neutral-500" />
              <span>PRIVASI PENUH: 100% PROSES LOKAL</span>
            </div>
          </div>
        </div>

        {/* Workspace Dual Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
          
          {/* LEFT WRAPPER: Live Canvas Preview Renderer with Studio Frames */}
          <section className="lg:col-span-7 flex flex-col justify-between h-full">
            <PosterPreview 
              designState={designState} 
              onDownload={handleDownload} 
            />
          </section>

          {/* RIGHT WRAPPER: Full custom controls and styling parameter inputs */}
          <section className="lg:col-span-5 h-full">
            <Toolbar 
              designState={designState} 
              setDesignState={setDesignState} 
            />
          </section>

        </div>

      </main>

      {/* Footer minimal signature details */}
      <footer className="w-full border-t border-[#2A2A2A] py-5 mt-6 text-center text-[9px] text-neutral-500 font-mono tracking-[0.2em]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <span>AESTHETIC POSTER STUDIO // ARTISTIC FLAIR EDITION</span>
          <span className="flex items-center gap-1 uppercase">
            DIGARAP DENGAN <Heart className="w-3 h-3 text-[#FF4F00] fill-[#FF4F00]" /> DAN CRAFTSMANSHIP TINGGI
          </span>
        </div>
      </footer>
    </div>
  );
}
