export interface Icon {
  id?: string;
  name: string;
  description: string;
  svg: string;
  category: string;
  isEdited?: boolean;
}

export interface IconCollection {
  id: string;
  name: string;
  icons: Icon[];
  created_at: string;
  icon_count: number;
}

export interface GenerateRequest {
  prompt: string;
  style?: 'modern' | 'classic' | 'minimal' | 'detailed';
  count?: number;
}

export interface GenerateResponse {
  success: boolean;
  data: {
    prompt: string;
    style: string;
    count: number;
    icons: Icon[];
    generated_at: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface EditableIcon extends Icon {
  selectedColor: string;
  selectedSize: number;
  strokeWidth: number;
}

export type ExportFormat = 'svg' | 'png' | 'jpg';
export type ExportSize = 16 | 24 | 32 | 48 | 64 | 128 | 256;