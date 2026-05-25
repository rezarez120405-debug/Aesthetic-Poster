import React, { useState, useRef } from 'react';
import { 
  DesignState, 
  AspectRatio, 
  LayoutPreset, 
  BorderStyle, 
  QuoteIconStyle, 
  ColorPalette 
} from '../types';
import { 
  FONTS, 
  SOLID_PALETTES, 
  GRADIENT_PALETTES, 
  QUOTE_PRESETS, 
  ASPECT_RATIOS, 
  LAYOUT_PRESETS 
} from '../data';
import { 
  Type, 
  Palette, 
  Sliders, 
  Quote, 
  Upload, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Smartphone, 
  Square, 
  FileText,
  Sparkles,
  Calendar,
  X,
  HelpCircle,
  Hash,
  Eye,
  Settings
} from 'lucide-react';

interface ToolbarProps {
  designState: DesignState;
  setDesignState: React.Dispatch<React.SetStateAction<DesignState>>;
}

export default function Toolbar({ designState, setDesignState }: ToolbarProps) {
  // Tabs for Toolbar: 'quote' | 'typography' | 'background' | 'effects'
  const [activeTab, setActiveTab] = useState<'quote' | 'typography' | 'background' | 'effects'>('quote');
  const [selectedQuoteCategory, setSelectedQuoteCategory] = useState<string>('Semua');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Quick extract unique categories from Quote presets
  const categories = ['Semua', ...Array.from(new Set(QUOTE_PRESETS.map(q => q.category)))];

  // Apply a dynamic preset colors and typography settings based on selection
  const applyPalette = (palette: ColorPalette) => {
    setDesignState(prev => {
      // Create new state
      const newState = { ...prev };
      newState.textColor = palette.textColor;
      newState.borderColor = palette.borderColor;
      newState.badgeColor = palette.badgeColor;
      
      if (palette.isGradient && palette.gradient) {
        newState.bgType = 'gradient';
        newState.bgGradient = palette.gradient;
      } else {
        newState.bgType = 'solid';
        newState.bgColor = palette.bgColor;
      }
      return newState;
    });
  };

  // Upload background image offline helper
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        setDesignState(prev => ({
          ...prev,
          bgType: 'image',
          bgImageSrc: e.target!.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeBgImage = () => {
    setDesignState(prev => ({
      ...prev,
      bgType: 'solid',
      bgImageSrc: null
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Pre-configured layout styling overrides for rapid aesthetic design matches
  const handlePresetChange = (preset: LayoutPreset) => {
    setDesignState(prev => {
      const updated = { ...prev, layoutPreset: preset };
      
      // Fine-tune styles specifically matching the aesthetic preset names
      switch (preset) {
        case 'minimalist':
          updated.fontFamily = "'Inter', sans-serif";
          updated.fontWeight = 'normal';
          updated.textAlign = 'center';
          updated.borderStyle = 'none';
          updated.quoteIconStyle = 'none';
          updated.textTransform = 'none';
          updated.lineHeight = 1.6;
          updated.letterSpacing = 0;
          break;
        case 'editorial':
          updated.fontFamily = "'Space Grotesk', sans-serif";
          updated.fontWeight = 'bold';
          updated.textAlign = 'left';
          updated.borderStyle = 'none';
          updated.quoteIconStyle = 'serif';
          updated.textTransform = 'uppercase';
          updated.lineHeight = 1.3;
          updated.letterSpacing = 1;
          break;
        case 'poetry':
          updated.fontFamily = "'Cormorant Garamond', serif";
          updated.fontWeight = 'normal';
          updated.fontStyle = 'italic';
          updated.textAlign = 'center';
          updated.borderStyle = 'brackets';
          updated.quoteIconStyle = 'curly';
          updated.textTransform = 'none';
          updated.lineHeight = 1.8;
          updated.letterSpacing = 0.5;
          break;
        case 'brutalist':
          updated.fontFamily = "'JetBrains Mono', monospace";
          updated.fontWeight = 'bold';
          updated.textAlign = 'left';
          updated.borderStyle = 'double';
          updated.quoteIconStyle = 'modern';
          updated.textTransform = 'uppercase';
          updated.lineHeight = 1.4;
          updated.letterSpacing = 1.5;
          break;
        case 'bold-statement':
          updated.fontFamily = "'Syne', sans-serif";
          updated.fontWeight = 'bold';
          updated.textAlign = 'center';
          updated.borderStyle = 'none';
          updated.quoteIconStyle = 'none';
          updated.textTransform = 'uppercase';
          updated.lineHeight = 1.1;
          updated.letterSpacing = -1;
          break;
      }
      return updated;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#161616] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl">
      {/* Category Tabs Selection Header */}
      <div className="grid grid-cols-4 bg-[#0F0F0F] p-1.5 border-b border-[#2A2A2A]">
        <button
          id="tab-quote"
          onClick={() => setActiveTab('quote')}
          className={`flex flex-col items-center gap-1 py-2.5 rounded text-center transition-all cursor-pointer min-h-[48px] ${
            activeTab === 'quote' 
              ? 'bg-[#FF4F00] text-white font-bold' 
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#161616]'
          }`}
        >
          <Quote className="w-4 h-4" />
          <span className="text-[9px] tracking-widest uppercase font-mono font-bold">Kutipan</span>
        </button>

        <button
          id="tab-typography"
          onClick={() => setActiveTab('typography')}
          className={`flex flex-col items-center gap-1 py-2.5 rounded text-center transition-all cursor-pointer min-h-[48px] ${
            activeTab === 'typography' 
              ? 'bg-[#FF4F00] text-white font-bold' 
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#161616]'
          }`}
        >
          <Type className="w-4 h-4" />
          <span className="text-[9px] tracking-widest uppercase font-mono font-bold">Tipografi</span>
        </button>

        <button
          id="tab-background"
          onClick={() => setActiveTab('background')}
          className={`flex flex-col items-center gap-1 py-2.5 rounded text-center transition-all cursor-pointer min-h-[48px] ${
            activeTab === 'background' 
              ? 'bg-[#FF4F00] text-white font-bold' 
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#161616]'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span className="text-[9px] tracking-widest uppercase font-mono font-bold">Latar</span>
        </button>

        <button
          id="tab-effects"
          onClick={() => setActiveTab('effects')}
          className={`flex flex-col items-center gap-1 py-2.5 rounded text-center transition-all cursor-pointer min-h-[48px] ${
            activeTab === 'effects' 
              ? 'bg-[#FF4F00] text-white font-bold' 
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#161616]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span className="text-[9px] tracking-widest uppercase font-mono font-bold">Efek</span>
        </button>
      </div>

      {/* Main Tab Panel scrolling body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[calc(100vh-280px)] md:max-h-[calc(100vh-200px)]">
        
        {/* ======================================= */}
        {/* TAB 1: KUTIPAN & LAYOUT                 */}
        {/* ======================================= */}
        {activeTab === 'quote' && (
          <div className="space-y-6">
            
            {/* Quick Presets Section */}
            <div className="p-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-300 tracking-[0.15em] flex items-center gap-1.5 font-sans uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF4F00]" />
                  Kutipan Cepat Studio
                </span>
                
                {/* Minimalist Categories dropdown */}
                <select
                  id="category-select"
                  value={selectedQuoteCategory}
                  onChange={(e) => setSelectedQuoteCategory(e.target.value)}
                  className="bg-[#161616] border border-[#2A2A2A] rounded text-[10px] font-bold text-neutral-300 px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#FF4F00] font-mono tracking-wider uppercase"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Scrollable list of quotes */}
              <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1">
                {QUOTE_PRESETS.filter(q => selectedQuoteCategory === 'Semua' || q.category === selectedQuoteCategory)
                  .map((quote, idx) => (
                    <button
                      key={idx}
                      id={`quote-preset-${idx}`}
                      onClick={() => setDesignState(prev => ({ ...prev, text: quote.text, author: quote.author }))}
                      className="w-full text-left p-2.5 rounded bg-[#161616] border border-[#2A2A2A] hover:border-[#FF4F00]/50 hover:bg-[#222] transition-all text-xs text-neutral-400 hover:text-neutral-200 duration-150 block truncate font-sans cursor-pointer group"
                    >
                      <q className="italic text-neutral-300 group-hover:text-white">{quote.text}</q>
                      <span className="block text-[9px] text-[#FF4F00] mt-1 font-mono tracking-wider uppercase font-semibold">— {quote.author}</span>
                    </button>
                ))}
              </div>
            </div>

            {/* Quote Inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] font-sans flex items-center justify-between">
                  <span>Input Teks Kutipan</span>
                  <span className="text-[9px] text-[#FF4F00] font-mono">{designState.text.length} Karakter</span>
                </label>
                <textarea
                  id="input-quote-text"
                  value={designState.text}
                  onChange={(e) => setDesignState(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] hover:border-neutral-700 focus:border-[#FF4F00] rounded p-3 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-[#FF4F00] transition-all duration-200 font-sans leading-relaxed min-h-[96px]"
                  placeholder="Ketik kutipan estetikmu sendiri disini..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] font-sans">
                  Penulis / Tokoh (Author)
                </label>
                <input
                  id="input-quote-author"
                  type="text"
                  value={designState.author}
                  onChange={(e) => setDesignState(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] hover:border-neutral-700 focus:border-[#FF4F00] rounded px-3 py-2.5 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-[#FF4F00] transition-all duration-200 font-sans min-h-[44px]"
                  placeholder="Nama Penulis..."
                />
              </div>
            </div>

            {/* Canvas Aspect Ratios Selector */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] font-sans">
                Ukuran Sosial Media (Aspect Ratio)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {ASPECT_RATIOS.map((ratio) => {
                  const isSelected = designState.aspectRatio === ratio.id;
                  return (
                    <button
                      key={ratio.id}
                      id={`ratio-select-${ratio.id}`}
                      onClick={() => setDesignState(prev => ({ ...prev, aspectRatio: ratio.id as AspectRatio }))}
                      className={`py-3 px-2 rounded border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer min-h-[44px] ${
                        isSelected 
                          ? 'border-white bg-[#FF4F00]/10 text-[#FF4F00] font-bold shadow-lg shadow-black/30' 
                          : 'border-[#2A2A2A] bg-[#0F0F0F] text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                      }`}
                    >
                      {ratio.id === 'square' && <Square className="w-4 h-4 opacity-80" />}
                      {ratio.id === 'portrait' && <FileText className="w-4 h-4 opacity-80" />}
                      {ratio.id === 'story' && <Smartphone className="w-4 h-4 opacity-80" />}
                      
                      <span className="text-[9px] font-bold uppercase tracking-wider block font-sans">
                        {ratio.id === 'square' ? 'Feed (1:1)' : ratio.id === 'portrait' ? 'Portrait (4:5)' : 'Story (9:16)'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layout Preset Styles */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] font-sans flex items-center justify-between">
                <span>Pilih Karakter Poster (Style Preset)</span>
                <span className="text-[9px] text-[#FF4F00] font-mono flex items-center gap-1 tracking-wider uppercase font-bold">
                  <Sliders className="w-3 h-3" /> Auto Styling
                </span>
              </label>
              <div className="space-y-2">
                {LAYOUT_PRESETS.map((p) => {
                  const isSelected = designState.layoutPreset === p.id;
                  return (
                    <button
                      key={p.id}
                      id={`style-preset-${p.id}`}
                      onClick={() => handlePresetChange(p.id as LayoutPreset)}
                      className={`w-full text-left p-3 rounded border transition-all duration-250 cursor-pointer ${
                        isSelected
                          ? 'border-[#FF4F00] bg-[#FF4F00]/10 text-white shadow-md font-semibold'
                          : 'border-[#2A2A2A] bg-[#0F0F0F] hover:bg-[#111] hover:border-[#333] text-neutral-400 hover:text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-sans tracking-wide uppercase">{p.name}</span>
                        {isSelected && <span className="w-2 h-2 bg-[#FF4F00] rounded-full" />}
                      </div>
                      <span className="block text-[10px] text-neutral-500 mt-1 font-sans leading-relaxed">{p.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* TAB 2: TIPOGRAFI & UKURAN               */}
        {/* ======================================= */}
        {activeTab === 'typography' && (
          <div className="space-y-6">
            
            {/* Font Family Choice with Visual Demos */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] font-sans">
                Jenis Font Utama
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FONTS.map((font) => {
                  const isSelected = designState.fontFamily === font.family;
                  return (
                    <button
                      key={font.id}
                      id={`font-family-${font.id}`}
                      onClick={() => setDesignState(prev => ({ ...prev, fontFamily: font.family }))}
                      className={`p-3 rounded border flex flex-col justify-between transition-all text-left h-[72px] cursor-pointer ${
                        isSelected
                          ? 'border-[1px] border-white bg-[#FF4F00]/10 text-white font-bold shadow-lg'
                          : 'border-[#2A2A2A] bg-[#0F0F0F] text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                      }`}
                    >
                      <span className="text-[9px] text-[#FF4F00] uppercase block tracking-wider font-mono select-none font-bold">{font.category}</span>
                      <span className="text-xs font-sans truncate font-medium" style={{ fontFamily: font.family }}>
                        {font.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Horizontal Text Alignment Buttons */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] font-sans">
                Rata Teks (Alignment)
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {(['left', 'center', 'right', 'justify'] as const).map((align) => {
                  const isSelected = designState.textAlign === align;
                  return (
                    <button
                      key={align}
                      id={`text-align-${align}`}
                      onClick={() => setDesignState(prev => ({ ...prev, textAlign: align }))}
                      className={`py-3.5 px-2 rounded border flex items-center justify-center transition-all cursor-pointer min-h-[44px] ${
                        isSelected 
                          ? 'border-white bg-[#FF4F00]/10 text-white font-bold' 
                          : 'border-[#2A2A2A] bg-[#0F0F0F] text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                      }`}
                    >
                      {align === 'left' && <AlignLeft className="w-4 h-4" />}
                      {align === 'center' && <AlignCenter className="w-4 h-4" />}
                      {align === 'right' && <AlignRight className="w-4 h-4" />}
                      {align === 'justify' && <AlignJustify className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text Styling Modifiers Grid */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] font-sans">
                Gaya Penulisan (Modifiers)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Weight */}
                <button
                  id="style-toggle-bold"
                  onClick={() => setDesignState(prev => ({ ...prev, fontWeight: prev.fontWeight === 'bold' ? 'normal' : 'bold' }))}
                  className={`py-2 rounded border text-[11px] font-bold tracking-wider cursor-pointer min-h-[44px] ${
                    designState.fontWeight === 'bold'
                      ? 'border-white bg-[#FF4F00]/10 text-white font-bold'
                      : 'border-[#2A2A2A] bg-[#0F0F0F] text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  TEBAL (B)
                </button>

                {/* Italic */}
                <button
                  id="style-toggle-italic"
                  onClick={() => setDesignState(prev => ({ ...prev, fontStyle: prev.fontStyle === 'italic' ? 'normal' : 'italic' }))}
                  className={`py-2 rounded border text-[11px] italic tracking-wider cursor-pointer min-h-[44px] ${
                    designState.fontStyle === 'italic'
                      ? 'border-white bg-[#FF4F00]/10 text-white font-bold'
                      : 'border-[#2A2A2A] bg-[#0F0F0F] text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  MIRING (I)
                </button>

                {/* Capitalize Case toggler */}
                <button
                  id="style-toggle-uppercase"
                  onClick={() => setDesignState(prev => ({ ...prev, textTransform: prev.textTransform === 'uppercase' ? 'none' : 'uppercase' }))}
                  className={`py-2 rounded border text-[11px] uppercase tracking-wider cursor-pointer min-h-[44px] ${
                    designState.textTransform === 'uppercase'
                      ? 'border-white bg-[#FF4F00]/10 text-white font-bold'
                      : 'border-[#2A2A2A] bg-[#0F0F0F] text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  KAPITAL (AA)
                </button>
              </div>
            </div>

            {/* Font Color inputs */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] font-sans flex items-center justify-between">
                <span>Warna Teks</span>
                <span className="text-[10px] text-[#FF4F00] font-mono font-bold uppercase">{designState.textColor}</span>
              </label>
              <div className="flex gap-4 items-center">
                <input
                  id="color-picker-text"
                  type="color"
                  value={designState.textColor}
                  onChange={(e) => setDesignState(prev => ({ ...prev, textColor: e.target.value }))}
                  className="w-12 h-12 rounded border border-[#2A2A2A] bg-transparent cursor-pointer overflow-hidden p-0"
                />
                <input
                  id="color-input-text-hex"
                  type="text"
                  maxLength={7}
                  value={designState.textColor}
                  onChange={(e) => setDesignState(prev => ({ ...prev, textColor: e.target.value }))}
                  className="flex-1 bg-[#0F0F0F] border border-[#2A2A2A] rounded px-3 py-2.5 text-xs font-mono text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#FF4F00] uppercase"
                />
              </div>
            </div>

            {/* Slider Parameters */}
            <div className="space-y-4 pt-2">
              
              {/* FontSize */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] font-sans">Ukuran Font</span>
                  <span className="text-[#FF4F00] font-mono font-bold">{Math.round(designState.fontSize * 100)}%</span>
                </div>
                <input
                  id="slider-font-size"
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={designState.fontSize}
                  onChange={(e) => setDesignState(prev => ({ ...prev, fontSize: parseFloat(e.target.value) }))}
                  className="w-full accent-[#FF4F00] cursor-pointer"
                />
              </div>

              {/* LineHeight */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] font-sans">Jarak Antar Baris</span>
                  <span className="text-[#FF4F00] font-mono font-bold">{designState.lineHeight}x</span>
                </div>
                <input
                  id="slider-line-height"
                  type="range"
                  min="1.0"
                  max="2.2"
                  step="0.05"
                  value={designState.lineHeight}
                  onChange={(e) => setDesignState(prev => ({ ...prev, lineHeight: parseFloat(e.target.value) }))}
                  className="w-full accent-[#FF4F00] cursor-pointer"
                />
              </div>

              {/* LetterSpacing */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] font-sans">Kerapatan Karakter</span>
                  <span className="text-[#FF4F00] font-mono font-bold">{designState.letterSpacing > 0 ? `+${designState.letterSpacing}` : designState.letterSpacing}</span>
                </div>
                <input
                  id="slider-letter-spacing"
                  type="range"
                  min="-0.1"
                  max="0.4"
                  step="0.02"
                  value={designState.letterSpacing}
                  onChange={(e) => setDesignState(prev => ({ ...prev, letterSpacing: parseFloat(e.target.value) }))}
                  className="w-full accent-[#FF4F00] cursor-pointer"
                />
              </div>

            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* TAB 3: LATAR BELAKANG                   */}
        {/* ======================================= */}
        {activeTab === 'background' && (
          <div className="space-y-6">
            
            {/* Predefined Solid Color Palettes */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] font-sans flex items-center justify-between">
                <span>Preset Warna Estetik</span>
                <span className="text-[10px] text-neutral-600 font-sans">Solid (Polos)</span>
              </label>
              <div className="grid grid-cols-5 gap-2 max-h-[110px] overflow-y-auto pr-1">
                {SOLID_PALETTES.map((palette, idx) => {
                  return (
                    <button
                      key={idx}
                      id={`palette-solid-${idx}`}
                      onClick={() => applyPalette(palette)}
                      className="w-full h-10 rounded-md relative overflow-hidden ring-1 ring-[#2A2A2A] border border-transparent hover:scale-105 active:scale-95 transition-all text-xs cursor-pointer"
                      style={{ backgroundColor: palette.bgColor }}
                      title={palette.name}
                    >
                      <span className="absolute bottom-1 right-2 block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: palette.textColor }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Predefined Gradients */}
            <div className="space-y-3 border-t border-[#2A2A2A] pt-4">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] font-sans flex items-center justify-between">
                <span>Preset Gradien Estetik</span>
                <span className="text-[10px] text-neutral-600 font-sans">Smooth</span>
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {GRADIENT_PALETTES.map((gradient, idx) => {
                  const gradientCss = gradient.gradient?.type === 'linear'
                    ? `linear-gradient(${gradient.gradient.angle}deg, ${gradient.gradient.colors.join(', ')})`
                    : `radial-gradient(circle, ${gradient.gradient?.colors.join(', ')})`;
                  
                  return (
                    <button
                      key={idx}
                      id={`palette-gradient-${idx}`}
                      onClick={() => applyPalette(gradient)}
                      className="w-full h-11 rounded-md relative overflow-hidden border border-[#2A2A2A] hover:scale-105 transition-all cursor-pointer text-xs"
                      style={{ background: gradientCss }}
                      title={gradient.name}
                    >
                      <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider font-mono bg-[#0F0F0F]/60 text-white uppercase scale-75 select-none">GRD</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Background Mode Selection */}
            <div className="space-y-3 border-t border-[#2A2A2A] pt-4">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] font-sans">
                Sumber Latar Belakang (Source)
              </label>
              <div className="grid grid-cols-3 bg-[#0F0F0F] p-1 rounded border border-[#2A2A2A]">
                {(['solid', 'gradient', 'image'] as const).map((type) => {
                  const isSelected = designState.bgType === type;
                  return (
                    <button
                      key={type}
                      id={`bg-type-${type}`}
                      onClick={() => setDesignState(prev => ({ ...prev, bgType: type }))}
                      className={`py-2 px-2.5 rounded text-[10px] font-bold transition-all uppercase tracking-wider text-center cursor-pointer min-h-[38px] ${
                        isSelected
                          ? 'bg-[#FF4F00] text-white shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {type === 'solid' ? 'Warna' : type === 'gradient' ? 'Gradien' : 'Gambar'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Background Configuration Controls */}
            <div className="space-y-4">
              
              {/* Context 1: SOLID COLOR EDITOR */}
              {designState.bgType === 'solid' && (
                <div className="space-y-3 p-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-sans">Kustomisasi Warna Latar</span>
                    <span className="text-neutral-200 font-mono font-bold uppercase">{designState.bgColor}</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <input
                      id="color-picker-bg-solid"
                      type="color"
                      value={designState.bgColor}
                      onChange={(e) => setDesignState(prev => ({ ...prev, bgColor: e.target.value }))}
                      className="w-12 h-12 rounded border border-[#2A2A2A] bg-transparent cursor-pointer overflow-hidden p-0"
                    />
                    <input
                      id="color-input-bg-hex"
                      type="text"
                      maxLength={7}
                      value={designState.bgColor}
                      onChange={(e) => setDesignState(prev => ({ ...prev, bgColor: e.target.value }))}
                      className="flex-1 bg-[#0F0F0F] border border-[#2A2A2A] rounded px-3.5 py-2.5 text-xs font-mono text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#FF4F00] uppercase"
                    />
                  </div>
                </div>
              )}

              {/* Context 2: GRADIENT EDITOR */}
              {designState.bgType === 'gradient' && (
                <div className="space-y-4 p-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-sans">Kustomisasi Warna Gradien</span>
                  
                  {/* Two color points editing */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 font-mono">Warna Utama</span>
                      <div className="flex gap-2">
                        <input
                          id="grad-color-1"
                          type="color"
                          value={designState.bgGradient.colors[0]}
                          onChange={(e) => {
                            const newColors = [...designState.bgGradient.colors];
                            newColors[0] = e.target.value;
                            setDesignState(prev => ({
                              ...prev,
                              bgGradient: { ...prev.bgGradient, colors: newColors }
                            }));
                          }}
                          className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold text-neutral-400 pt-1.5 uppercase select-none">{designState.bgGradient.colors[0]}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 font-mono">Warna Kedua</span>
                      <div className="flex gap-2">
                        <input
                          id="grad-color-2"
                          type="color"
                          value={designState.bgGradient.colors[1] || '#FFFFFF'}
                          onChange={(e) => {
                            const newColors = [...designState.bgGradient.colors];
                            newColors[1] = e.target.value;
                            setDesignState(prev => ({
                              ...prev,
                              bgGradient: { ...prev.bgGradient, colors: newColors }
                            }));
                          }}
                          className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold text-neutral-400 pt-1.5 uppercase select-none">{designState.bgGradient.colors[1] || '#FFFFFF'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Gradient Angle Slider */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-500 font-sans font-semibold">Sudut Kemiringan</span>
                      <span className="text-[#FF4F00] font-mono font-bold">{designState.bgGradient.angle}°</span>
                    </div>
                    <input
                      id="grad-angle-slider"
                      type="range"
                      min="0"
                      max="360"
                      step="5"
                      value={designState.bgGradient.angle}
                      onChange={(e) => setDesignState(prev => ({
                        ...prev,
                        bgGradient: { ...prev.bgGradient, angle: parseInt(e.target.value) }
                      }))}
                      className="w-full accent-[#FF4F00] cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Context 3: OFFLINE IMAGE UPLOADER */}
              {designState.bgType === 'image' && (
                <div className="space-y-4 p-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-sans">Gambar Galeri Mandiri</span>
                  
                  {!designState.bgImageSrc ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#2A2A2A] hover:border-[#FF4F00]/50 hover:bg-[#161616] rounded p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center gap-2 group"
                    >
                      <Upload className="w-8 h-8 text-neutral-600 group-hover:text-[#FF4F00] transition-colors" />
                      <span className="text-xs font-bold text-neutral-400 group-hover:text-neutral-300 font-sans uppercase">Upload Gambar Kunci</span>
                      <span className="text-[10px] text-neutral-600 font-sans">Format JPG/PNG sepenuhnya lokal</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Image Preview and Trash */}
                      <div className="flex items-center justify-between p-2.5 bg-[#161616] rounded border border-[#2A2A2A]">
                        <div className="flex items-center gap-2">
                          <img
                            src={designState.bgImageSrc}
                            alt="Background input thumbnail"
                            className="w-12 h-12 rounded object-cover border border-[#2A2A2A]"
                          />
                          <span className="text-xs font-sans text-neutral-400 max-w-[120px] truncate font-medium">Gambar Terunggah</span>
                        </div>
                        <button
                          id="btn-remove-bg-image"
                          onClick={removeBgImage}
                          className="p-2 bg-rose-950/50 hover:bg-rose-900 border border-rose-900/60 rounded text-rose-200 transition-colors cursor-pointer min-h-[40px]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Image Opacity Layer Controller */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500 font-sans font-semibold">Kejelasan Gambar (Opacity)</span>
                          <span className="text-[#FF4F00] font-mono font-bold">{Math.round(designState.bgImageOpacity * 100)}%</span>
                        </div>
                        <input
                          id="image-opacity-slider"
                          type="range"
                          min="0.05"
                          max="1.0"
                          step="0.05"
                          value={designState.bgImageOpacity}
                          onChange={(e) => setDesignState(prev => ({ ...prev, bgImageOpacity: parseFloat(e.target.value) }))}
                          className="w-full accent-[#FF4F00] cursor-pointer"
                        />
                      </div>

                      {/* Cover blur slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500 font-sans font-semibold">Efek Fokus Buram (Blur)</span>
                          <span className="text-[#FF4F00] font-mono font-bold">{designState.bgImageBlur}px</span>
                        </div>
                        <input
                          id="image-blur-slider"
                          type="range"
                          min="0"
                          max="25"
                          step="1"
                          value={designState.bgImageBlur}
                          onChange={(e) => setDesignState(prev => ({ ...prev, bgImageBlur: parseInt(e.target.value) }))}
                          className="w-full accent-[#FF4F00] cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Hidden standard file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}

            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* TAB 4: AKSESORIS & VINTAGE EFFECTS      */}
        {/* ======================================= */}
        {activeTab === 'effects' && (
          <div className="space-y-6">
            
            {/* Film Grain (Aesthetic Pixel Noise) Overlay */}
            <div className="p-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded space-y-4">
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.15em] flex items-center gap-1.5 font-sans">
                <Sliders className="w-3.5 h-3.5 text-[#FF4F00]" />
                Tekstur Vintage (Film Grain)
              </span>

              {/* Grain Volume slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500 font-semibold font-sans">Intensitas Grain</span>
                  <span className="text-[#FF4F00] font-mono font-bold">{Math.round(designState.grainOpacity * 100)}%</span>
                </div>
                <input
                  id="slider-grain-opacity"
                  type="range"
                  min="0.0"
                  max="0.4"
                  step="0.02"
                  value={designState.grainOpacity}
                  onChange={(e) => setDesignState(prev => ({ ...prev, grainOpacity: parseFloat(e.target.value) }))}
                  className="w-full accent-[#FF4F00] cursor-pointer"
                />
              </div>

              {/* Color of Noise grain: Light or Dark */}
              {designState.grainOpacity > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 font-mono block">Warna Piksel Grain</span>
                  <div className="grid grid-cols-2 bg-[#0F0F0F] p-1 rounded border border-[#2A2A2A] gap-1.5">
                    <button
                      id="grain-color-light"
                      onClick={() => setDesignState(prev => ({ ...prev, grainColor: 'light' }))}
                      className={`py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
                        designState.grainColor === 'light'
                          ? 'bg-[#FF4F00] text-white font-bold'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      Putih (Salju)
                    </button>
                    <button
                      id="grain-color-dark"
                      onClick={() => setDesignState(prev => ({ ...prev, grainColor: 'dark' }))}
                      className={`py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
                        designState.grainColor === 'dark'
                          ? 'bg-[#FF4F00] text-white font-bold'
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      Hitam (Dusty)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Poster Framings and Borders */}
            <div className="p-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded space-y-4">
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.15em] flex items-center gap-1.5 font-sans">
                <Hash className="w-3.5 h-3.5 text-[#FF4F00]" />
                Desain Pembatas (Border Frame)
              </span>

              {/* Border Styles select cards */}
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'none', label: 'Tanpa Bingkai' },
                  { id: 'thin', label: 'Klasik Tipis' },
                  { id: 'thick', label: 'Klasik Tebal' },
                  { id: 'double', label: 'Ganda' },
                  { id: 'brackets', label: 'Kurung Siku' },
                  { id: 'art-deco', label: 'Premium Deco' }
                ] as const).map((style) => {
                  const isSelected = designState.borderStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      id={`border-style-${style.id}`}
                      onClick={() => setDesignState(prev => ({ ...prev, borderStyle: style.id as BorderStyle }))}
                      className={`py-2 rounded border flex flex-col justify-center items-center text-center transition-all h-[52px] cursor-pointer ${
                        isSelected
                          ? 'border-white bg-[#FF4F00]/10 text-white font-bold'
                          : 'border-[#2A2A2A] bg-[#0F0F0F] text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-[10px] tracking-tight block leading-tight font-sans font-medium">{style.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Advanced borders styling sliders & color pickers */}
              {designState.borderStyle !== 'none' && (
                <div className="space-y-4 pt-2 border-t border-[#2A2A2A]">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 font-mono block">Ketebalan Garis</span>
                      <input
                        id="border-width-slider"
                        type="range"
                        min="0.5"
                        max="5.0"
                        step="0.2"
                        value={designState.borderWidth}
                        onChange={(e) => setDesignState(prev => ({ ...prev, borderWidth: parseFloat(e.target.value) }))}
                        className="w-full accent-[#FF4F00] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 font-mono block">Warna Bingkai</span>
                      <div className="flex gap-2">
                        <input
                          id="border-color-picker"
                          type="color"
                          value={designState.borderColor}
                          onChange={(e) => setDesignState(prev => ({ ...prev, borderColor: e.target.value }))}
                          className="w-7 h-7 rounded border border-[#2A2A2A] bg-transparent cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold text-neutral-400 pt-1 uppercase select-none">{designState.borderColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quote marks icons style */}
            <div className="p-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded space-y-4">
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.15em] flex items-center gap-1.5 font-sans">
                <Quote className="w-3.5 h-3.5 text-[#FF4F00]" />
                Dekorasi Tanda Kutip (Quote Marks)
              </span>

              <div className="grid grid-cols-5 gap-1.5">
                {([
                  { id: 'none', label: 'Sembunyi' },
                  { id: 'serif', label: 'Elegance' },
                  { id: 'curly', label: 'Curly' },
                  { id: 'modern', label: 'Modern' },
                  { id: 'clean', label: 'Box' }
                ] as const).map((style) => {
                  const isSelected = designState.quoteIconStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      id={`quote-icon-style-${style.id}`}
                      onClick={() => setDesignState(prev => ({ ...prev, quoteIconStyle: style.id as QuoteIconStyle }))}
                      className={`py-2 rounded border flex flex-col justify-center items-center text-center transition-all h-[42px] cursor-pointer ${
                        isSelected
                          ? 'border-white bg-[#FF4F00]/10 text-white font-bold'
                          : 'border-[#2A2A2A] bg-[#0F0F0F] text-neutral-500 hover:text-neutral-350'
                      }`}
                    >
                      <span className="text-[10px] tracking-tight font-sans leading-none font-medium">{style.label}</span>
                    </button>
                  );
                })}
              </div>

              {designState.quoteIconStyle !== 'none' && (
                <div className="space-y-4 pt-2 border-t border-[#2A2A2A]">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Scale Size */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 font-mono block">Skala Tombol</span>
                      <input
                        id="quote-icon-scale-slider"
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.05"
                        value={designState.quoteIconSize}
                        onChange={(e) => setDesignState(prev => ({ ...prev, quoteIconSize: parseFloat(e.target.value) }))}
                        className="w-full accent-[#FF4F00] cursor-pointer"
                      />
                    </div>
                    {/* Opacity */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 font-mono block">Kejelasan Tanda</span>
                      <input
                        id="quote-icon-opacity-slider"
                        type="range"
                        min="0.05"
                        max="1.0"
                        step="0.05"
                        value={designState.quoteIconOpacity}
                        onChange={(e) => setDesignState(prev => ({ ...prev, quoteIconOpacity: parseFloat(e.target.value) }))}
                        className="w-full accent-[#FF4F00] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Quote icon color picker */}
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 font-mono">Warna Tanda Kutip</span>
                    <input
                      id="quote-icon-color-picker"
                      type="color"
                      value={designState.quoteIconColor}
                      onChange={(e) => setDesignState(prev => ({ ...prev, quoteIconColor: e.target.value }))}
                      className="w-8 h-8 rounded border border-[#2A2A2A] bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold text-neutral-400 uppercase select-none">{designState.quoteIconColor}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Badges, watermarks and social metadata details */}
            <div className="p-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded space-y-4">
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.15em] flex items-center gap-1.5 font-sans">
                <Settings className="w-3.5 h-3.5 text-[#FF4F00]" />
                Sosial Media Watermark & Badges
              </span>

              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 font-mono">Teks Badge Label Atas</span>
                  <input
                    id="input-badge-text"
                    type="text"
                    value={designState.badgeText}
                    onChange={(e) => setDesignState(prev => ({ ...prev, badgeText: e.target.value }))}
                    className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#FF4F00] font-sans"
                    placeholder="Contoh: WISDOM // COL. 01"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 font-mono">Teks Watermark Bawah</span>
                  <input
                    id="input-watermark-text"
                    type="text"
                    value={designState.watermarkText}
                    onChange={(e) => setDesignState(prev => ({ ...prev, watermarkText: e.target.value }))}
                    className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#FF4F00] font-sans"
                    placeholder="Contoh: @rezarez120405"
                  />
                </div>

                {/* Switch Date Badge */}
                <div className="flex items-center justify-between p-2.5 bg-[#161616] rounded border border-[#2A2A2A]">
                  <span className="text-xs font-semibold text-neutral-400 tracking-wider font-sans flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    Tampilkan Tanggal Otomatis
                  </span>
                  <input
                    id="toggle-show-date"
                    type="checkbox"
                    checked={designState.showDate}
                    onChange={(e) => setDesignState(prev => ({ ...prev, showDate: e.target.checked }))}
                    className="w-4 h-4 cursor-pointer accent-[#FF4F00]"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
