export interface QrisPopupSettings {
  enabled: boolean;
  title: string;
  description: string;
  imageUrl: string;
  footnote: string;
  countdownSeconds: number;
}

export interface Banner {
  id: number;
  imageUrl: string;
  linkUrl: string | null;
  title: string | null;
  sortOrder: number;
  isActive: boolean;
}

export type AdSlotPlacement = "home_top" | "home_bottom" | "detail_top";

export interface AdSenseSlot {
  id: string;
  name: string;
  placement: AdSlotPlacement;
  code: string;
  enabled: boolean;
}
