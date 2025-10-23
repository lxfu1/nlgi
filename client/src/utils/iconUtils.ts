import { ExportFormat, ExportSize } from '../types';

export const downloadIcon = async (
  svg: string,
  filename: string,
  format: ExportFormat = 'svg',
  size: ExportSize = 32
): Promise<void> => {
  try {
    const blob = await createBlob(svg, format, size);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    // 延迟移除链接，避免部分浏览器点击失效
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (err) {
    console.error('Download failed:', err);
    throw err;
  }
};

export const createBlob = (
  svg: string,
  format: ExportFormat,
  size: ExportSize
): Promise<Blob> => {
  if (format === 'svg') {
    return Promise.resolve(new Blob([svg], { type: 'image/svg+xml' }));
  }

  if (!svg.trim().startsWith('<svg')) {
    return Promise.reject(new Error('Invalid SVG: must start with <svg>'));
  }
  if (!svg.includes('</svg>')) {
    return Promise.reject(new Error('Invalid SVG: missing </svg> closing tag'));
  }

  // 限制 SVG 大小（10MB）
  const MAX_SVG_SIZE = 10 * 1024 * 1024;
  if (new Blob([svg]).size > MAX_SVG_SIZE) {
    return Promise.reject(new Error('SVG is too large (max 10MB)'));
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return reject(new Error('Canvas context is unavailable'));
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      try {
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(
                new Error('Canvas to Blob failed (possibly tainted canvas)')
              );
            }
          },
          `image/${format}`,
          0.95
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          'SVG load failed: check for invalid syntax, cross-origin resources, or large size'
        )
      );
    };

    img.src = url;
  });
};

export const optimizeSVG = (svg: string): string => {
  return svg
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim();
};

export const modifySVGColor = (svg: string, color: string): string => {
  // 获取 <svg> 的 fill 和 stroke 属性
  const svgFillMatch = svg.match(/<svg\b[^>]*\bfill\s*=\s*(['"])([^'">]+)\1/i);
  const svgFill = svgFillMatch ? svgFillMatch[2].trim().toLowerCase() : '';

  const svgStrokeMatch = svg.match(
    /<svg\b[^>]*\bstroke\s*=\s*(['"])([^'">]+)\1/i
  );
  const svgStroke = svgStrokeMatch
    ? svgStrokeMatch[2].trim().toLowerCase()
    : '';

  // 匹配所有图形元素（不包括 <svg>）
  const tagRe = /<(circle|rect|path|ellipse|polygon|line|polyline)\b[^>]*>/gi;

  return svg.replace(tagRe, (match, tagName) => {
    let element = match;
    const tag = tagName.toLowerCase();

    // ---- 1️⃣ path 特殊处理 ----
    if (tag === 'path') {
      // 1a) SVG fill 存在且不为 none → 修改 path fill
      if (svgFill && svgFill !== 'none') {
        const fillMatch = element.match(/fill\s*=\s*(['"])([^'">]*?)\1/i);
        if (fillMatch) {
          const fillVal = fillMatch[2].trim().toLowerCase();
          if (fillVal !== 'none') {
            element = element.replace(
              /fill\s*=\s*(['"])([^'">]*?)\1/i,
              `fill="${color}"`
            );
          }
        } else {
          element = element.replace(/(\s*\/?>)/, ` fill="${color}"$1`);
        }
      }

      // 1b) SVG stroke 存在且不为 none → 修改 path stroke
      if (svgStroke && svgStroke !== 'none') {
        if (/stroke\s*=\s*['"][^'"]*['"]/i.test(element)) {
          element = element.replace(
            /stroke\s*=\s*(['"])([^'">]*?)\1/i,
            `stroke="${color}"`
          );
        } else {
          element = element.replace(/(\s*\/?>)/, ` stroke="${color}"$1`);
        }
      }

      // 1c) 如果 SVG fill=none 且 stroke=none → 默认逻辑：不改
    } else {
      // ---- 2️⃣ 其他元素逻辑（circle/rect/ellipse/line/polygon/polyline） ----
      const fillMatch = element.match(/fill\s*=\s*(['"])([^'">]*?)\1/i);
      if (fillMatch) {
        const fillVal = fillMatch[2].trim().toLowerCase();
        if (fillVal !== 'none') {
          element = element.replace(
            /fill\s*=\s*(['"])([^'">]*?)\1/i,
            `fill="${color}"`
          );
        }
      }
    }

    // ---- 3️⃣ stroke-width 逻辑 ----
    if (/stroke-width\s*=\s*['"][^'"]+['"]/i.test(element)) {
      if (/stroke\s*=\s*['"][^'"]*['"]/i.test(element)) {
        element = element.replace(
          /stroke\s*=\s*(['"])([^'">]*?)\1/i,
          `stroke="${color}"`
        );
      } else {
        element = element.replace(/(\s*\/?>)/, ` stroke="${color}"$1`);
      }
    }

    return element;
  });
};

export const modifySVGSize = (svg: string, size: number): string => {
  return svg
    .replace(/width="[^"]*"/g, `width="${size}"`)
    .replace(/height="[^"]*"/g, `height="${size}"`)
    .replace(/viewBox="[^"]*"/g, `viewBox="0 0 ${size} ${size}"`);
};

export const modifyStrokeWidth = (svg: string, strokeWidth: number): string => {
  const tagRe = /<(circle|rect|path|ellipse|polygon|line|polyline)\b[^>]*>/gi;

  return svg.replace(tagRe, (match) => {
    let element = match;

    // ---- 1️⃣ 已存在 stroke-width，直接替换 ----
    if (/stroke-width\s*=\s*['"][^'"]+['"]/i.test(element)) {
      element = element.replace(
        /stroke-width\s*=\s*(['"])[^'"]*\1/i,
        `stroke-width="${strokeWidth}"`
      );
      return element;
    }

    // ---- 2️⃣ 没有 stroke-width，但存在 stroke，则新增 ----
    if (/stroke\s*=\s*['"][^'"]+['"]/i.test(element)) {
      element = element.replace(
        /(\s*\/?>)/,
        ` stroke-width="${strokeWidth}"$1`
      );
    }

    // ---- 3️⃣ 其他情况（无 stroke），保持原样 ----
    return element;
  });
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

export const generateIconName = (description: string): string => {
  return description
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

export const calculateSVGComplexity = (svg: string): number => {
  const elements =
    svg.match(/<(circle|rect|path|polygon|polyline|ellipse|line|g)/g) || [];
  return elements.length;
};
