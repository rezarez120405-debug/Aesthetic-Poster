import { DesignState } from '../types';
import { FONTS } from '../data';

// Helper to load an image from URL/DataURL
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Gagal memuat gambar latar belakang: ' + e));
    img.src = src;
  });
};

// Helper to ensure a font is loaded in the page prior to canvas drawing
export const ensureFontLoaded = async (state: DesignState): Promise<void> => {
  const fontObj = FONTS.find(f => f.family === state.fontFamily || f.name === state.fontFamily);
  const familyName = fontObj ? fontObj.name : 'Arial';
  
  // Format font criteria for DocumentFonts api
  // e.g. "normal 400 16px 'Playfair Display'"
  const weight = state.fontWeight === 'bold' ? '700' : '400';
  const style = state.fontStyle === 'italic' ? 'italic' : 'normal';
  
  try {
    const fontStr = `${style} ${weight} 16px "${familyName}"`;
    await document.fonts.load(fontStr);
  } catch (err) {
    console.warn('Font loading skipped or failed. Using browser fallback.', err);
  }
};

interface WrapLine {
  text: string;
  width: number;
}

// Wrap text to fit maxWidth
export const wrapAndFitText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): WrapLine[] => {
  const words = text.split(' ');
  const lines: WrapLine[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      lines.push({
        text: currentLine,
        width: ctx.measureText(currentLine).width
      });
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push({
      text: currentLine,
      width: ctx.measureText(currentLine).width
    });
  }
  return lines;
};

// Main Canvas Renderer Function
export const renderPosterToCanvas = async (
  state: DesignState,
  targetWidth?: number,
  targetHeight?: number
): Promise<HTMLCanvasElement> => {
  // Determine Canvas Dimensions
  let width = 1080;
  let height = 1080;

  if (targetWidth && targetHeight) {
    width = targetWidth;
    height = targetHeight;
  } else {
    // High-res rendering specifications
    switch (state.aspectRatio) {
      case 'square':
        width = 2048;
        height = 2048;
        break;
      case 'portrait':
        width = 2048;
        height = 2560; // 4:5 ratio
        break;
      case 'story':
        width = 1080;
        height = 1920; // 9:16 ratio
        break;
    }
  }

  // Set up Canvas Element
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain canvas 2D context');

  // Activate High-Quality Text Rendering
  ctx.textBaseline = 'alphabetic';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Make sure fonts are loaded
  await ensureFontLoaded(state);

  // 1. DRAW BACKGROUND
  if (state.bgType === 'solid') {
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0, 0, width, height);
  } else if (state.bgType === 'gradient') {
    const config = state.bgGradient;
    if (config.type === 'linear') {
      // Calculate linear gradient path using angle (degrees)
      const angleRad = (config.angle * Math.PI) / 180;
      
      const x1 = width / 2 - (Math.cos(angleRad) * width) / 2;
      const y1 = height / 2 - (Math.sin(angleRad) * height) / 2;
      const x2 = width / 2 + (Math.cos(angleRad) * width) / 2;
      const y2 = height / 2 + (Math.sin(angleRad) * height) / 2;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      config.colors.forEach((col, idx) => {
        grad.addColorStop(idx / (config.colors.length - 1), col);
      });
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Radial or Mesh fallback
      const grad = ctx.createRadialGradient(
        width / 2, height / 2, 10,
        width / 2, height / 2, Math.max(width, height) / 1.5
      );
      config.colors.forEach((col, idx) => {
        grad.addColorStop(idx / (config.colors.length - 1), col);
      });
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  } else if (state.bgType === 'image' && state.bgImageSrc) {
    try {
      // First fill with backing solid color in case image has transparency/fails
      ctx.fillStyle = state.bgColor || '#1A1A1A';
      ctx.fillRect(0, 0, width, height);

      const img = await loadImage(state.bgImageSrc);
      
      // Keep canvas context clean
      ctx.save();
      
      // Multi-layer blurs/cover image calculations
      const imgRatio = img.width / img.height;
      const canvasRatio = width / height;
      let dWidth = width;
      let dHeight = height;
      let dx = 0;
      let dy = 0;

      if (imgRatio > canvasRatio) {
        dWidth = height * imgRatio;
        dx = -(dWidth - width) / 2;
      } else {
        dHeight = width / imgRatio;
        dy = -(dHeight - height) / 2;
      }

      // Draw with custom image properties
      ctx.globalAlpha = state.bgImageOpacity;
      
      if (state.bgImageBlur > 0) {
        // Modern approach: Draw to canvas with image blur filter
        ctx.filter = `blur(${state.bgImageBlur * (width / 500)}px)`; // Scale blur factor according to width resolution
      }
      
      ctx.drawImage(img, dx, dy, dWidth, dHeight);
      ctx.restore();
    } catch (err) {
      console.error('Error drawing cover background image:', err);
      // Fallback on solid
      ctx.fillStyle = state.bgColor || '#1A1A1A';
      ctx.fillRect(0, 0, width, height);
    }
  }

  // 2. GENERATE AESTHETIC NOISE/FILM GRAIN DIRECTLY IN CLIENT (100% Procedural)
  if (state.grainOpacity > 0) {
    // Generate organic film/paper noise
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = Math.min(width, 1024); // Cap procedural performance texture scaling
    tempCanvas.height = Math.min(height, 1024);
    const tempCtx = tempCanvas.getContext('2d');
    
    if (tempCtx) {
      const gWidth = tempCanvas.width;
      const gHeight = tempCanvas.height;
      const imgData = tempCtx.createImageData(gWidth, gHeight);
      const density = imgData.data;
      const strength = state.grainOpacity * 255;
      const isDark = state.grainColor === 'dark';

      for (let i = 0; i < density.length; i += 4) {
        const rand = Math.random() * strength;
        if (isDark) {
          density[i] = 0;     // Red
          density[i+1] = 0;   // Green
          density[i+2] = 0;   // Blue
        } else {
          density[i] = 255;   // Red
          density[i+1] = 255; // Green
          density[i+2] = 255; // Blue
        }
        density[i+3] = rand;  // Alpha noise strength
      }
      tempCtx.putImageData(imgData, 0, 0);
      
      // Cover the target canvas with the tiled noise texture
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      const pattern = ctx.createPattern(tempCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.restore();
    }
  }

  // Calculate layout safety margins and scaling factors
  const shortDim = Math.min(width, height);
  const margin = shortDim * 0.1; // 10% safety margin standard
  const contentWidth = width - margin * 2;
  const contentHeight = height - margin * 2;

  // 3. DRAW CUSTOM DESIGN BORDERS
  if (state.borderStyle !== 'none') {
    ctx.save();
    ctx.lineWidth = Math.max(2, state.borderWidth * (shortDim / 200));
    ctx.strokeStyle = state.borderColor;
    
    if (state.borderStyle === 'thin' || state.borderStyle === 'thick') {
      const inset = margin / 2;
      ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);
    } else if (state.borderStyle === 'double') {
      const inset1 = margin / 2;
      const inset2 = inset1 + ctx.lineWidth * 1.5;
      ctx.strokeRect(inset1, inset1, width - inset1 * 2, height - inset1 * 2);
      
      ctx.lineWidth = ctx.lineWidth * 0.5;
      ctx.strokeRect(inset2, inset2, width - inset2 * 2, height - inset2 * 2);
    } else if (state.borderStyle === 'brackets') {
      const inset = margin / 1.8;
      const len = shortDim * 0.08;
      
      // Top-Left corner
      ctx.beginPath();
      ctx.moveTo(inset + len, inset);
      ctx.lineTo(inset, inset);
      ctx.lineTo(inset, inset + len);
      ctx.stroke();

      // Top-Right corner
      ctx.beginPath();
      ctx.moveTo(width - inset - len, inset);
      ctx.lineTo(width - inset, inset);
      ctx.lineTo(width - inset, inset + len);
      ctx.stroke();

      // Bottom-Left corner
      ctx.beginPath();
      ctx.moveTo(inset + len, height - inset);
      ctx.lineTo(inset, height - inset);
      ctx.lineTo(inset, height - inset - len);
      ctx.stroke();

      // Bottom-Right corner
      ctx.beginPath();
      ctx.moveTo(width - inset - len, height - inset);
      ctx.lineTo(width - inset, height - inset);
      ctx.lineTo(width - inset, height - inset - len);
      ctx.stroke();
    } else if (state.borderStyle === 'art-deco') {
      const inset = margin / 1.8;
      ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);
      
      // Draw minimal internal framing details
      const detailInset = inset + ctx.lineWidth * 2;
      ctx.beginPath();
      ctx.moveTo(detailInset, detailInset + 30);
      ctx.lineTo(detailInset, detailInset);
      ctx.lineTo(detailInset + 30, detailInset);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - detailInset, detailInset + 30);
      ctx.lineTo(width - detailInset, detailInset);
      ctx.lineTo(width - detailInset - 30, detailInset);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(detailInset, height - detailInset - 30);
      ctx.lineTo(detailInset, height - detailInset);
      ctx.lineTo(detailInset + 30, height - detailInset);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - detailInset, height - detailInset - 30);
      ctx.lineTo(width - detailInset, height - detailInset);
      ctx.lineTo(width - detailInset - 30, height - detailInset);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 4. DRAW DECORATIVE WATERMARK & BADGE (Swiss info lines / design tags)
  ctx.save();
  const metaFontObj = state.layoutPreset === 'brutalist' 
    ? FONTS.find(f => f.id === 'jetbrains') 
    : FONTS.find(f => f.id === 'space-grotesk') || FONTS.find(f => f.id === 'inter');
  const metaFamily = metaFontObj ? metaFontObj.family : 'Arial';
  ctx.fillStyle = state.textColor;

  // Header/Footer Placement relative to layoutPresets
  const headerY = margin * 1.1;
  const footerY = height - margin * 1.1;

  // Let's print Badge Info
  if (state.badgeText && state.badgeText.trim() !== '') {
    ctx.font = `600 ${shortDim * 0.016}px ${metaFamily}`;
    const badgeTextUpper = state.badgeText.toUpperCase();
    const metrics = ctx.measureText(badgeTextUpper);
    const badgeW = metrics.width + 24;
    const badgeH = shortDim * 0.035;

    let badgeX = width / 2 - badgeW / 2;
    let badgeY = headerY - badgeH / 2;

    if (state.layoutPreset === 'editorial') {
      badgeX = margin; // Left side
      badgeY = headerY;
    } else if (state.layoutPreset === 'brutalist') {
      badgeX = margin;
      badgeY = headerY;
    }

    // Draw badge background
    ctx.save();
    ctx.fillStyle = state.badgeColor;
    // draw minor rounded rectangle for modern look or sharp box for brutalist
    const radius = state.layoutPreset === 'brutalist' ? 0 : 5;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY - badgeH / 1.5, badgeW, badgeH, radius);
    ctx.fill();

    // Draw badge text
    ctx.fillStyle = state.layoutPreset === 'brutalist' ? '#000000' : state.textColor;
    
    // In case background and text contrast feels off inside badge
    // we can analyze tone and enforce readable contrast
    const hexToRgb = (hex: string) => {
      const match = hex.replace(/^#/, '').match(/.{1,2}/g);
      if (!match) return { r: 255, g: 255, b: 255 };
      return {
        r: parseInt(match[0], 16),
        g: parseInt(match[1], 16),
        b: parseInt(match[2], 16)
      };
    };
    try {
      const rgb = hexToRgb(state.badgeColor);
      const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
      ctx.fillStyle = brightness > 128 ? '#111111' : '#FFFFFF';
    } catch {}

    ctx.textAlign = 'center';
    ctx.fillText(badgeTextUpper, badgeX + badgeW / 2, badgeY);
    ctx.restore();
  }

  // Draw Watermark Design Credit
  if (state.watermarkText && state.watermarkText.trim() !== '') {
    ctx.font = `400 ${shortDim * 0.015}px ${metaFamily}`;
    ctx.fillStyle = state.watermarkColor;
    ctx.textAlign = state.layoutPreset === 'editorial' || state.layoutPreset === 'brutalist' ? 'right' : 'center';
    
    const wx = state.layoutPreset === 'editorial' || state.layoutPreset === 'brutalist' 
      ? width - margin 
      : width / 2;
    
    ctx.fillText(state.watermarkText, wx, footerY);
  }

  // Draw Date Metadata if enabled
  if (state.showDate) {
    const today = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const formattedDate = `${months[today.getMonth()]} ${today.getFullYear()} // VOL. ${today.getDate()}`;
    
    ctx.font = `500 ${shortDim * 0.014}px ${metaFamily}`;
    ctx.fillStyle = state.textColor;
    ctx.globalAlpha = 0.5;
    ctx.textAlign = 'left';
    ctx.fillText(formattedDate, margin, footerY);
    ctx.globalAlpha = 1.0;
  }
  ctx.restore();

  // 5. DRAW ORNAMENT SPEECH BUBBLE/QUOTE ICON
  if (state.quoteIconStyle !== 'none') {
    ctx.save();
    ctx.fillStyle = state.quoteIconColor;
    ctx.globalAlpha = state.quoteIconOpacity;
    
    let qX = width / 2;
    let qY = height * 0.28;
    const qSize = shortDim * 0.08 * state.quoteIconSize;

    if (state.layoutPreset === 'editorial') {
      qX = margin;
      qY = height * 0.26;
    } else if (state.layoutPreset === 'brutalist') {
      qX = margin;
      qY = height * 0.22;
    } else if (state.layoutPreset === 'poetry') {
      qX = width / 2;
      qY = height * 0.3;
    }

    ctx.translate(qX, qY);

    if (state.quoteIconStyle === 'serif') {
      ctx.font = `italic 700 ${qSize * 2.2}px "Playfair Display", Georgia, serif`;
      ctx.textAlign = state.layoutPreset === 'editorial' || state.layoutPreset === 'brutalist' ? 'left' : 'center';
      ctx.fillText('“', 0, qSize * 0.5);
    } else if (state.quoteIconStyle === 'curly') {
      ctx.font = `800 ${qSize * 2}px "Cormorant Garamond", Georgia, serif`;
      ctx.textAlign = state.layoutPreset === 'editorial' || state.layoutPreset === 'brutalist' ? 'left' : 'center';
      ctx.fillText('“', 0, qSize * 0.5);
    } else if (state.quoteIconStyle === 'modern') {
      // Procedural modern minimal quotation block style
      ctx.fillRect(-qSize / 2, -qSize * 0.3, qSize * 0.2, qSize * 0.6);
      ctx.fillRect(-qSize * 0.1, -qSize * 0.3, qSize * 0.2, qSize * 0.6);
    } else if (state.quoteIconStyle === 'clean') {
      // Delicate floating frames
      ctx.lineWidth = 2;
      ctx.strokeStyle = state.quoteIconColor;
      ctx.strokeRect(-qSize / 3, -qSize / 3, qSize * 0.6, qSize * 0.6);
    }

    ctx.restore();
  }

  // 6. RENDER THE GREAT TEXT LAYOUT SYSTEM
  ctx.save();
  
  // Font configuration
  const fontObj = FONTS.find(f => f.family === state.fontFamily || f.name === state.fontFamily);
  const selectedFamily = fontObj ? fontObj.family : 'Arial';
  
  // Automatic font sizing adjusts for letter count to prevent overflows
  const characterCount = state.text.length;
  let lenScale = 1.0;
  
  if (characterCount > 180) {
    lenScale = 0.60;
  } else if (characterCount > 120) {
    lenScale = 0.72;
  } else if (characterCount > 80) {
    lenScale = 0.85;
  } else if (characterCount > 40) {
    lenScale = 0.95;
  }

  // Base typography size defaults of layout configurations
  let relativeFontSize = 0.054; // default base percentage of shortDim
  switch (state.layoutPreset) {
    case 'minimalist':
      relativeFontSize = 0.046;
      break;
    case 'editorial':
      relativeFontSize = 0.052;
      break;
    case 'poetry':
      relativeFontSize = 0.042;
      break;
    case 'brutalist':
      relativeFontSize = 0.044;
      break;
    case 'bold-statement':
      relativeFontSize = 0.076;
      break;
  }

  // Final computed base font size
  const finalFontSize = shortDim * relativeFontSize * state.fontSize * lenScale;
  const wordSpacing = finalFontSize * state.letterSpacing; // custom spacer letter gaps helper
  
  ctx.fillStyle = state.textColor;
  
  // Construct ctx.font specification
  const styleString = `${state.fontStyle === 'italic' ? 'italic' : ''} ${state.fontWeight === 'bold' ? '700' : '400'} ${finalFontSize}px ${selectedFamily}`;
  ctx.font = styleString.trim();
  
  // Set Alignment natively
  ctx.textAlign = state.textAlign === 'justify' ? 'left' : state.textAlign;

  // Text alignment helper variables
  let textX = width / 2;
  let textY = height / 2;
  let maxTextWidth = contentWidth * 0.9;

  // Layout-specific alignment and structure
  if (state.layoutPreset === 'editorial') {
    textX = margin * 1.1;
    textY = height * 0.42;
    maxTextWidth = contentWidth * 0.95;
    ctx.textAlign = 'left';
  } else if (state.layoutPreset === 'brutalist') {
    textX = margin * 1.1;
    textY = height * 0.38;
    maxTextWidth = contentWidth * 0.95;
    ctx.textAlign = 'left';
  } else if (state.layoutPreset === 'poetry') {
    textX = width / 2;
    textY = height * 0.48;
    maxTextWidth = contentWidth * 0.82;
    ctx.textAlign = 'center';
  } else if (state.layoutPreset === 'bold-statement') {
    textX = width / 2;
    textY = height * 0.42;
    maxTextWidth = contentWidth * 1.0;
    ctx.textAlign = 'center';
  } else {
    // minimalist
    textX = width / 2;
    textY = height * 0.45;
  }

  // Split and wrap the text safely
  const rawText = state.textTransform === 'uppercase' 
    ? state.text.toUpperCase() 
    : state.textTransform === 'lowercase' 
      ? state.text.toLowerCase() 
      : state.text;
      
  const lines = wrapAndFitText(ctx, rawText, maxTextWidth);
  const actualLineHeight = finalFontSize * state.lineHeight;
  
  // Calculate vertical offset to center align texts perfectly on poster core
  let totalTextHeight = lines.length * actualLineHeight;
  
  // Fine tune Y position relative to layouts
  if (state.layoutPreset === 'minimalist' || state.layoutPreset === 'poetry') {
    // Perfectly center text blocks
    textY = (height / 2) - (totalTextHeight / 2) + (finalFontSize / 3);
  }

  // Draw lines
  lines.forEach((line, index) => {
    const curY = textY + index * actualLineHeight;
    
    // Core font letter-spacing simulation in HTML5 Canvas
    // Standard ctx.letterSpacing is a new experimental property, so we fallback with custom char renderer if spacing is significant
    if (state.letterSpacing > 0) {
      drawTextWithLetterSpacing(ctx, line.text, textX, curY, state.letterSpacing * finalFontSize * 0.15, state.textAlign, line.width, maxTextWidth);
    } else {
      ctx.fillText(line.text, textX, curY);
    }
  });

  // 7. DRAW AUTHOR AT BOTTOM/ASIDES IN ABSOLUTE ELEGANCE
  if (state.author && state.author.trim() !== '') {
    ctx.restore(); // Reset typography scale to draw small classy metadata
    ctx.save();

    const authorText = state.layoutPreset === 'brutalist' 
      ? `// BY: ${state.author.toUpperCase()}` 
      : `— ${state.author}`;

    // Select clean secondary fonts for author labels
    let authorFontFamily = selectedFamily;
    let authorFontSize = finalFontSize * 0.45; // Make author proportional to quote
    let authorWeight = '500';
    let authorStyle = 'normal';

    if (state.layoutPreset === 'poetry') {
      authorFontFamily = "'Playfair Display', serif";
      authorStyle = 'italic';
      authorFontSize = finalFontSize * 0.5;
    } else if (state.layoutPreset === 'editorial') {
      authorFontFamily = metaFamily;
      authorWeight = '600';
      authorFontSize = shortDim * 0.024;
    } else if (state.layoutPreset === 'brutalist') {
      authorFontFamily = "'JetBrains Mono', monospace";
      authorWeight = '700';
      authorFontSize = shortDim * 0.022;
    }

    ctx.font = `${authorStyle} ${authorWeight} ${authorFontSize}px ${authorFontFamily}`;
    ctx.fillStyle = state.textColor;
    ctx.textAlign = state.textAlign === 'justify' ? 'left' : state.textAlign as CanvasTextAlign;

    let ax = textX;
    let ay = textY + totalTextHeight + (actualLineHeight * 0.7);

    if (state.layoutPreset === 'editorial') {
      ax = margin * 1.1;
      ay = textY + totalTextHeight + (actualLineHeight * 0.75);
      ctx.textAlign = 'left';
    } else if (state.layoutPreset === 'brutalist') {
      ax = margin * 1.1;
      ay = textY + totalTextHeight + (actualLineHeight * 0.8);
      ctx.textAlign = 'left';
    } else if (state.layoutPreset === 'poetry') {
      ax = width / 2;
      ay = textY + totalTextHeight + (actualLineHeight * 0.85);
      ctx.textAlign = 'center';
    } else if (state.layoutPreset === 'bold-statement') {
      ax = width / 2;
      ay = textY + totalTextHeight + (actualLineHeight * 0.6);
      ctx.textAlign = 'center';
    }

    ctx.fillText(authorText, ax, ay);
    ctx.restore();
  }

  return canvas;
};

// Procedural text renderer supporting high-precision custom letter spacing letter-by-letter
const drawTextWithLetterSpacing = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
  align: 'left' | 'center' | 'right' | 'justify',
  lineWidth: number,
  maxWidth: number
) => {
  // Check if browser natively supports letterSpacing
  if ('letterSpacing' in (ctx as any)) {
    (ctx as any).letterSpacing = `${spacing}px`;
    ctx.fillText(text, x, y);
    (ctx as any).letterSpacing = '0px'; // reset
    return;
  }

  // Procedural fallback
  const chars = text.split('');
  let totalWidth = 0;
  const widths = chars.map(c => {
    const w = ctx.measureText(c).width;
    totalWidth += w;
    return w;
  });

  const spacedTotalWidth = totalWidth + (chars.length - 1) * spacing;
  let startX = x;

  if (align === 'center') {
    startX = x - spacedTotalWidth / 2;
  } else if (align === 'right') {
    startX = x - spacedTotalWidth;
  }

  let currentX = startX;
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], currentX, y);
    currentX += widths[i] + spacing;
  }
};
