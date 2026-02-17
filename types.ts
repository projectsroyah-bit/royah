
export enum SectionType {
  COLORS = 'الألوان الرئيسية',
  CONTACT = 'معلومات التواصل',
  FILES = 'الملفات المهمة',
  TEXT_BANK = 'بنك النصوص',
  VISUAL_ASSETS = 'مكتبة الأصول البصرية',
  LINKS = 'روابط مهمة'
}

export interface IdentityRecord {
  id: string;
  section: SectionType;
  label: string;
  value: string;
  email?: string;
  hex: string;
}

export interface BrandFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  category: string; // New field for grouping
  preview?: string; // For images
}

export interface BrandText {
  id: string;
  label: string;
  content: string;
  category: string;
}

export interface BrandLink {
  id: string;
  label: string;
  url: string;
  category: string;
}
