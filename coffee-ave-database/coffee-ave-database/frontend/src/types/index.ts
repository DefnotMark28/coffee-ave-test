export type ProductCategory = 
  | 'all'
  | 'coffee'
  | 'features'
  | 'exterior'
  | 'interior'
  | 'bakery';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subCategory?: string;
  price: number;
  description: string;
  tag?: 'BEST SELLER' | 'FRESH DAILY' | 'NEW ITEM' | 'VIP EXCLUSIVE';
  tagColor?: 'gold' | 'crimson' | 'emerald';
  imageUrl: string;
  imageFallbackGradient: string;
  isWashPackage: boolean;
  estimatedTime?: string;
  options?: {
    label: string;
    choices: string[];
  }[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  isWashPackage: boolean;
  selectedOption?: string;
  imageUrl: string;
}

export type WashStage = 1 | 2 | 3; // 1: Preparing, 2: Cleaning & Prep, 3: Ready for Pickup

export interface VehicleQueueItem {
  id: string;
  plateNumber: string;
  vehicleModel: string;
  vehicleColor: string;
  colorHex: string;
  servicePackage: string;
  startTime: string;
  estimatedDuration: string;
  stage: WashStage;
  stageName: 'Preparing' | 'Cleaning & Prep' | 'Ready for Pickup';
  stageProgressPercent: number; // 0 - 100
  bayNumber: number;
  customerName?: string;
  cafeOrderLinked?: string;
  drinkStatus?: 'Brewing' | 'Served at Table' | 'None';
  tableNumber?: string;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'wash' | 'cafe' | 'promo';
}
