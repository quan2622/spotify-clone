import { create } from "zustand";
import ColorThief from 'colorthief';

interface UIStore {
  error: null | string,
  mainSize: number,
  primColor: string,
  dominantColor: string,
  hanldeChangeMainSize: (size: number) => void,
  handleGetPrimColor: (imageUrl: string) => void,
}

export const useUIStore = create<UIStore>((set) => ({
  mainSize: 0,
  primColor: 'linear-gradient(to bottom, #27272A 0%, #202023 10%, #1A1A1F 40%, #18181B66 70%, #18181B33 100%)',
  dominantColor: "",
  error: null,

  hanldeChangeMainSize: (size) => {
    try {
      set({ mainSize: size });
    } catch (error: any) {
      set({ error: error });
    }
  },

  handleGetPrimColor: (imageUrl) => {
    try {
      const colorThief = new ColorThief();
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        try {
          // const dominantColor = colorThief.getColor(img); // get primary color
          const palette = <number[][]> colorThief.getPalette(img, 8);
          let mainColor = <number[]> [];
          if (palette.length > 0) {
            const brightness = palette.reduce((max, curr) => getBrightNess(curr) > getBrightNess(max) ? curr : max);
            mainColor = brightness;
          }

          const hexColor = `#${mainColor.map(x => x.toString(16).padStart(2, '0')).join('')}`;
          const gradient = createGradientFromColor(hexColor);

          set({
            primColor: gradient,
            dominantColor: hexColor,
          });
        } catch (error) {
          console.error('Error when get color - ', error)
        }
      }

      img.onerror = () => console.error("Cannot load image");
    } catch (error: any) {
      set({ error: error })
    }
  }
}));

// Get Brightness
const getBrightNess = ([r, g, b]: number[]) => {
  return (r * 299 + g * 587 + b * 144) / 1000;
}

// Get Primary Color
const hexToRgb = (hexColor: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

const createGradientFromColor = (hexColor: string) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return "";

  // Tạo các shade tối dần (80%, 40%, 20%)
  const shade1 = {
    r: Math.round(rgb.r * 0.8),
    g: Math.round(rgb.g * 0.8),
    b: Math.round(rgb.b * 0.8)
  };

  const shade2 = {
    r: Math.round(rgb.r * 0.4),
    g: Math.round(rgb.g * 0.4),
    b: Math.round(rgb.b * 0.4)
  };

  const shade3 = {
    r: Math.round(rgb.r * 0.2),
    g: Math.round(rgb.g * 0.2),
    b: Math.round(rgb.b * 0.2)
  };

  const color1 = rgbToHex(rgb.r, rgb.g, rgb.b);      // Màu gốc
  const color2 = rgbToHex(shade1.r, shade1.g, shade1.b); // 80%
  const color3 = rgbToHex(shade2.r, shade2.g, shade2.b); // 40%
  const color4 = rgbToHex(shade3.r, shade3.g, shade3.b); // 20%

  return `linear-gradient(to bottom, ${color1} 0%, ${color2} 10%, ${color3} 25%, ${color4} 40%, #000000 60%)`;
}