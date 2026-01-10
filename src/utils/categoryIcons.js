/**
 * Centralized Category Icons Map
 * 
 * Use this utility across all screens to get consistent icons for categories.
 */
import { 
  Car, 
  Smartphone, 
  Building2, 
  Tv, 
  Sofa, 
  Shirt, 
  Bike, 
  PartyPopper, 
  HeartPulse, 
  Tent, 
  HardHat, 
  Music, 
  Wrench,
  Laptop,
  Package // Default fallback icon
} from 'lucide-react-native';

// Icon map matching CATEGORIES from config/categories.js
export const CATEGORY_ICONS = {
  'Automobile': Car,
  'Mobiles': Smartphone,
  'Property': Building2,
  'Electronics & Appliances': Tv,
  'Furniture': Sofa,
  'Fashion': Shirt,
  'Two Wheelers': Bike,
  'Event Supplies': PartyPopper,
  'Medical': HeartPulse,
  'Travel & Camping': Tent,
  'Construction': HardHat,
  'Instruments': Music,
  'Services': Wrench,
};

// Default fallback icon
export const DEFAULT_CATEGORY_ICON = Package;

/**
 * Get the icon component for a category name
 * @param {string} categoryName - The name of the category
 * @returns {React.ComponentType} - The icon component
 */
export const getCategoryIcon = (categoryName) => {
  if (!categoryName) return DEFAULT_CATEGORY_ICON;
  
  // 1. Exact match
  if (CATEGORY_ICONS[categoryName]) {
    return CATEGORY_ICONS[categoryName];
  }
  
  // 2. Case-insensitive match (trim whitespace)
  const normalizedName = categoryName.trim().toLowerCase();
  const key = Object.keys(CATEGORY_ICONS).find(
    k => k.toLowerCase() === normalizedName
  );
  
  return key ? CATEGORY_ICONS[key] : DEFAULT_CATEGORY_ICON;
};

/**
 * Render a category icon with given props
 * @param {string} categoryName - The name of the category
 * @param {object} props - Props to pass to the icon (size, color, strokeWidth)
 * @returns {React.ReactElement} - The rendered icon
 */
export const renderCategoryIcon = (categoryName, props = { size: 20, color: '#FFF', strokeWidth: 1.5 }) => {
  const IconComponent = getCategoryIcon(categoryName);
  return <IconComponent {...props} />;
};

export default CATEGORY_ICONS;
