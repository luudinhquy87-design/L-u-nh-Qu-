
export interface CharacterSlot {
  id: number;
  file: File | null;
  selected: boolean;
}

export interface BackgroundSlot {
  file: File | null;
  use: boolean;
}

export interface ImageData {
  data: string;
  mimeType: string;
}
