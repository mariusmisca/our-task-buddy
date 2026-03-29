export interface Route {
  id: string;
  name: string;
  locations: Location[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  routeId: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  notes?: string;
}

export interface Action {
  id: string;
  name: string;
  hexColor: string;
  stock: number;
}

export interface Visit {
  id: string;
  locationId: string;
  actionId: string;
  round: number;
  week: number;
  date: Date;
  status: 'proposed' | 'delivered';
  photo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  actionId: string;
  available: number;
  proposed: number;
  delivered: number;
}

export interface LocationStatus {
  locationId: string;
  actionsDelivered: string[];
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
