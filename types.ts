
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  resellerPrice: number;
  category: string;
  imageUrl: string;
  validity: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// User interface now includes an optional password field for creation
export interface User {
  email: string;
  name: string;
  password?: string; // Optional because we don't store it after registration
  role: 'customer' | 'reseller' | 'admin';
}
