import { useEffect, useRef, useState } from 'react';
import { DesignState } from '../types';
import { ASPECT_RATIOS } from '../data';
import { renderPosterToCanvas } from '../utils/canvasRenderer';
import { Loader2, Sparkles, ZoomIn, Image as ImageIcon } from 'lucide-react';

interface PosterPreviewProps {
  designState: DesignState;
  onDownload: (format: 'png' | 'jpeg') => void;
}

export default function PosterPreview({ designState, onDownload }: PosterPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [previewStyle, setPreviewStyle] = useState<'solid' | 'gallery-dark' | 'gallery-light'>('solid');

  // Find aspect ratio config
  const currentRatio = ASPECT_RATIOS.find(r => r.id === designState.aspectRatio) || ASPECT_RATIOS[0];

  // 1. Hook up ResizeObserver to watch container bounds and scale preview responsively
  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      if (!entries || entries.length === 0) return;
      
      const { width: containerWidth, height: containerHeight } = entries[0].contentRect;
      
      // Calculate best fitting dimensions keeping the aspect ratio
      const targetRatio = currentRatio.ratio; // width / height
      
      // Maximize rendering area depending on limiting dimension
      let scaledWidth = containerWidth;
      let scaledHeight = containerWidth / targetRatio;

      if (scaledHeight > containerHeight) {
        scaledHeight = containerHeight;
        scaledWidth = containerHeight * targetRatio;
      }

      // Add a small safety padding so preview doesn't hug edges snugly
      scaledWidth = Math.floor(scaledWidth * 0.92);
      scaledHeight = Math.floor(scaledHeight * 0.92);

      setDimensions({
        width: Math.max(280, scaledWidth),
        height: Math.max(280, scaledHeight)
      });
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [currentRatio]);

  // 2. Render Canvas in real-time when DesignState or computed dimensions change
  useEffect(() => {
    let active = true;
    
    const drawPreview = async () => {
      if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;
      
      setIsRendering(true);
      setRenderError(null);
      
      try {
        // Redraw on the preview canvas
        const renderedCanvas = await renderPosterToCanvas(
          designState, 
          dimensions.width * 1.5, // 1.5x pixel multiplier for ultra-smooth clean text preview on retina screens
          dimensions.height * 1.5
        );
        
        if (!active) return;

        // Draw the temporary canvas contents onto the active preview canvas
        const mainCanvas = canvasRef.current;
        mainCanvas.width = dimensions.width;
        mainCanvas.height = dimensions.height;
        const ctx = mainCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(renderedCanvas, 0, 0, dimensions.width, dimensions.height);
        }
      } catch (err: any) {
        console.error('Error drawing realtime preview:', err);
        if (active) setRenderError(err.message || 'Error occurred during preview compilation');
      } finally {
        if (active) setIsRendering(false);
      }
    };

    // Debounce preview drawing to handle rapid slider drags smoothly
    const timeoutId = setTimeout(drawPreview, 60);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [designState, dimensions]);

  // Determine mockup card wrappers styling classes
  const getMockupBackground = () => {
    switch (previewStyle) {
      case 'gallery-dark':
        return 'bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-950 shadow-inner border border-[#2A2A2A]';
      case 'gallery-light':
        return 'bg-gradient-to-tr from-neutral-200 via-neutral-100 to-amber-50 shadow-inner border border-neutral-300';
      default:
        // Studio mode features the iconic Artistic Flair dot pattern and dark canvas
        return 'bg-[#0F0F0F] dot-pattern border-t border-[#2A2A2A]';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#161616] rounded-2xl border border-[#2A2A2A] overflow-hidden">
      {/* Top Header Controls bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-[#2A2A2A] bg-[#161616] gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF4F00]" />
          <h3 className="text-xs font-bold text-neutral-200 tracking-[0.2em] font-sans uppercase">
            Studio / Live Canvas
          </h3>
        </div>
        
        {/* Toggle Simulated Environment Modes */}
        <div className="flex bg-[#0F0F0F] p-1 rounded-lg border border-[#2A2A2A] gap-1">
          <button
            id="view-mode-clean"
            onClick={() => setPreviewStyle('solid')}
            className={`px-3 py-1 text-[11px] font-bold rounded transition-all duration-200 uppercase tracking-wider ${
              previewStyle === 'solid'
                ? 'bg-[#FF4F00] text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#161616]'
            }`}
          >
            Studio
          </button>
          <button
            id="view-mode-gallery-dark"
            onClick={() => setPreviewStyle('gallery-dark')}
            className={`px-3 py-1 text-[11px] font-bold rounded transition-all duration-200 uppercase tracking-wider ${
              previewStyle === 'gallery-dark'
                ? 'bg-[#FF4F00] text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#161616]'
            }`}
          >
            Gallery Dark
          </button>
          <button
            id="view-mode-gallery-light"
            onClick={() => setPreviewStyle('gallery-light')}
            className={`px-3 py-1 text-[11px] font-bold rounded transition-all duration-200 uppercase tracking-wider ${
              previewStyle === 'gallery-light'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#161616]'
            }`}
          >
            Gallery Light
          </button>
        </div>
      </div>

      {/* Main Preview Container Box */}
      <div 
        ref={containerRef} 
        className={`flex-1 flex items-center justify-center p-6 sm:p-10 transition-all duration-500 relative ${getMockupBackground()}`}
        style={{ minHeight: '340px' }}
      >
        {/* Loading Spinner */}
        {isRendering && (
          <div className="absolute top-4 right-4 z-20 bg-[#161616]/95 border border-[#2A2A2A] text-neutral-300 backdrop-blur-md px-3 py-1.5 rounded-md text-[10px] flex items-center gap-2 font-mono">
            <Loader2 className="w-3 h-3 animate-spin text-[#FF4F00]" />
            <span>RENDERING...</span>
          </div>
        )}

        {/* Failed Rendering Box */}
        {renderError && (
          <div className="absolute inset-x-6 p-4 z-20 bg-rose-950/90 border border-rose-800 text-rose-200 rounded-xl text-xs flex flex-col gap-2 font-sans">
            <span className="font-semibold">Format Error</span>
            <span>{renderError}</span>
          </div>
        )}

        {/* Mockup Frame to present the Canvas artistically like a realistic physical canvas */}
        <div 
          className="relative transition-all duration-300"
          style={{ 
            width: `${dimensions.width}px`, 
            height: `${dimensions.height}px`,
          }}
        >
          {/* Aesthetic Shadowing Details for Gallery feeling */}
          {previewStyle !== 'solid' && (
            <div className={`absolute inset-0 rounded shadow-2xl transition-all duration-500 ${
              previewStyle === 'gallery-light' 
                ? 'shadow-neutral-600/60 ring-8 ring-amber-900/5 rotate-[0.5deg]' 
                : 'shadow-black/90 ring-8 ring-white/5 rotate-[0.5deg]'
            }`} />
          )}

          {/* Core Interactive HTML5 Canvas */}
          <canvas
            id="artwork-canvas"
            ref={canvasRef}
            className={`w-full h-full block rounded overflow-hidden relative z-10 select-none transition-all duration-300 ${
              previewStyle === 'gallery-light' ? 'shadow-lg border border-neutral-300' : 'shadow-2xl border border-neutral-800'
            }`}
          />

          {/* Decorative Corner Bracket Lines overlaying in gallery style */}
          {previewStyle !== 'solid' && (
            <div className={`absolute -inset-2.5 pointer-events-none z-10 transition-colors duration-300 ${
              previewStyle === 'gallery-light' ? 'border-neutral-400/40' : 'border-neutral-700/30'
            } border`} />
          )}
        </div>

        {/* Status Info (from Artistic Flair design spec) */}
        <div className="absolute bottom-4 right-4 flex gap-6 items-center pointer-events-none select-none opacity-80">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-[#666] uppercase font-bold tracking-widest">Canvas Scale</span>
            <span className="text-[11px] text-neutral-400 font-mono">{currentRatio.width}x{currentRatio.height} ({designState.aspectRatio})</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-[#666] uppercase font-bold tracking-widest">Status</span>
            <span className="text-[11px] text-[#FF4F00] font-mono uppercase tracking-wider font-bold">Ready</span>
          </div>
        </div>
      </div>

      {/* Downloader Bottom Controls Layout */}
      <div className="px-6 py-5 border-t border-[#2A2A2A] bg-[#161616] flex flex-wrap gap-4 items-center justify-between">
        <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 font-mono">
          <ZoomIn className="w-3.5 h-3.5 text-neutral-500" />
          <span>OUTPUT:</span>
          <span className="text-neutral-200 font-semibold uppercase">{designState.aspectRatio}</span>
          <span className="text-neutral-600">|</span>
          <span className="text-[#FF4F00] font-bold">ULTRA-HD</span>
        </div>

        {/* Download Buttons Formats */}
        <div className="flex gap-2.5">
          <button
            id="btn-download-jpg"
            onClick={() => onDownload('jpeg')}
            className="px-5 py-2.5 rounded hover:bg-[#222] text-xs font-bold text-neutral-300 border border-[#333] hover:text-white transition-all cursor-pointer font-sans min-h-[44px]"
          >
            JPEG
          </button>
          
          <button
            id="btn-download-png"
            onClick={() => onDownload('png')}
            className="px-6 py-2.5 rounded bg-[#FF4F00] hover:bg-[#FF6A29] text-white font-bold text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 group min-h-[44px]"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Export .PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
