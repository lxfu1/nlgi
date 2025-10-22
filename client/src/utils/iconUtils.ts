import { ExportFormat, ExportSize } from '../types';

export const downloadIcon = async (
  svg: string,
  filename: string,
  format: ExportFormat = 'svg',
  size: ExportSize = 32
): Promise<void> => {
  const blob = await createBlob(svg, format, size);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const createBlob = (
  svg: string,
  format: ExportFormat,
  size: ExportSize
): Blob => {
  if (format === 'svg') {
    return new Blob([svg], { type: 'image/svg+xml' });
  }

  // For PNG/JPG, convert SVG to canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const img = new Image();
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise<Blob>((resolve) => {
    img.onload = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, `image/${format}`, 0.95);
    };
    img.src = url;
  }) as any;
};

export const optimizeSVG = (svg: string): string => {
  return svg
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim();
};

export const modifySVGColor = (svg: string, color: string): string => {
  // Add or modify fill attribute
  if (svg.includes('fill=')) {
    return svg.replace(/fill="[^"]*"/g, `fill="${color}"`);
  } else {
    return svg.replace('<svg', `<svg fill="${color}"`);
  }
};

export const modifySVGSize = (svg: string, size: number): string => {
  return svg
    .replace(/width="[^"]*"/g, `width="${size}"`)
    .replace(/height="[^"]*"/g, `height="${size}"`)
    .replace(/viewBox="[^"]*"/g, `viewBox="0 0 ${size} ${size}"`);
};

export const modifyStrokeWidth = (svg: string, strokeWidth: number): string => {
  if (svg.includes('stroke-width=')) {
    return svg.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);
  } else if (svg.includes('stroke')) {
    return svg.replace('<svg', `<svg stroke-width="${strokeWidth}"`);
  }
  return svg;
};

export const validateSVG = (svg: string): boolean => {
  if (!svg || typeof svg !== 'string') return false;
  if (!svg.includes('<svg') || !svg.includes('</svg>')) return false;
  if (!svg.includes('</')) return false; // Basic check for closing tags
  return true;
};

export const extractSVGFromDataUrl = (dataUrl: string): string => {
  try {
    const matches = dataUrl.match(/data:image\/svg\+xml,(.*)/);
    if (matches && matches[1]) {
      return decodeURIComponent(matches[1]);
    }
    return '';
  } catch (error) {
    console.error('Failed to extract SVG from data URL:', error);
    return '';
  }
};

export const createSVGDataUrl = (svg: string): string => {
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
};

export const copySVGToClipboard = async (svg: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(svg);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = svg;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy SVG to clipboard:', error);
    return false;
  }
};

export const generateIconName = (description: string, index: number): string => {
  const baseName = description
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  return `${baseName}-${index + 1}`;
};

export const calculateSVGComplexity = (svg: string): number => {
  const elements = svg.match(/<(circle|rect|path|polygon|polyline|ellipse|line|g)/g) || [];
  return elements.length;
};