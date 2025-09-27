export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  notes?: string;
}

export interface BoxColor {
  id: string;
  name: string;
  hexColor: string;
  stock: number;
}

export interface Visit {
  id: string;
  locationId: string;
  colorId: string;
  round: number; // 1, 2, or 3
  week: number; // 1, 2, or 3
  date: Date;
  status: 'proposed' | 'delivered';
  photo?: string; // base64 or file path
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  colorId: string;
  available: number;
  proposed: number;
  delivered: number;
}

export interface LocationStatus {
  locationId: string;
  colorsDelivered: string[]; // Array of color IDs that have been delivered
  totalProposed: number;
  totalDelivered: number;
  lastVisitDate?: Date;
}

export interface Campaign {
  currentRound: number;
  currentWeek: number;
  startDate: Date;
  totalLocations: number;
  completedLocations: number;
}