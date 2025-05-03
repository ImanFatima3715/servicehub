
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'seeker' | 'provider' | 'admin';
  profileImage?: string;
  isApproved?: boolean;
  createdAt?: string;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  provider: User | string;
  packages: ServicePackage[];
  createdAt?: string;
}

export interface ServicePackage {
  _id?: string;
  name: string;
  duration: string;
  visitsIncluded: number;
  discountPercent: number;
  finalPrice: number;
}

export interface Booking {
  _id: string;
  service: Service;
  seeker: User | string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  package?: ServicePackage;
  createdAt?: string;
}

export interface Emergency {
  _id: string;
  seeker: User | string;
  serviceNeeded: string;
  location: string;
  description: string;
  status: 'pending' | 'assigned' | 'resolved';
  createdAt?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
