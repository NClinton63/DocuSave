export type DocumentCategory =
  | 'supplies'
  | 'transport'
  | 'rent'
  | 'food'
  | 'utilities'
  | 'other';

export interface DocumentModel {
  id: string;
  imageUri: string;
  thumbnailUri?: string;
  amount: number;
  currency: 'XAF';
  date: string; // ISO 8601
  category: DocumentCategory;
  vendorName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentInput = Omit<DocumentModel, 'id' | 'createdAt' | 'updatedAt'>;

export interface CategoryModel {
  id: DocumentCategory;
  nameEn: string;
  nameFr: string;
  icon: string;
}

export interface AppSettings {
  language: 'en' | 'fr';
  autoLockTimeout: number; // milliseconds
  theme: 'system' | 'light' | 'dark';
}

export interface PinState {
  isSetupComplete: boolean;
  hashedPin?: string;
}
