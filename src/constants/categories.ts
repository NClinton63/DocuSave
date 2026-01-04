import { CategoryModel } from '../models/types';

export const categories: CategoryModel[] = [
  { id: 'supplies', nameEn: 'Supplies', nameFr: 'Fournitures', icon: 'package-variant' },
  { id: 'transport', nameEn: 'Transport', nameFr: 'Transport', icon: 'truck' },
  { id: 'rent', nameEn: 'Rent', nameFr: 'Loyer', icon: 'home' },
  { id: 'food', nameEn: 'Food', nameFr: 'Repas', icon: 'silverware-fork-knife' },
  { id: 'utilities', nameEn: 'Utilities', nameFr: 'Services', icon: 'lightning-bolt' },
  { id: 'other', nameEn: 'Other', nameFr: 'Autre', icon: 'dots-horizontal' },
];
