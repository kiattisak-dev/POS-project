import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  date: Date;
  total: number;
  method: 'cash' | 'card' | 'transfer';
  status: 'pending' | 'completed' | 'cancelled';
  items: { productId: string; quantity: number; price: number }[];
}

interface AppState {
  products: Product[];
  orders: Order[];
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Order actions
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Coffee Beans',
    price: 450,
    stock: 25,
    description: 'High-quality arabica coffee beans',
    category: 'Beverages',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Organic Tea Set',
    price: 320,
    stock: 15,
    description: 'Premium organic tea collection',
    category: 'Beverages',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '3',
    name: 'Artisan Chocolate',
    price: 280,
    stock: 30,
    description: 'Handcrafted dark chocolate',
    category: 'Food',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  }
];

const mockOrders: Order[] = [
  {
    id: 'ORD001',
    date: new Date('2024-01-20'),
    total: 1150,
    method: 'card',
    status: 'completed',
    items: [
      { productId: '1', quantity: 2, price: 450 },
      { productId: '3', quantity: 1, price: 280 }
    ]
  },
  {
    id: 'ORD002',
    date: new Date('2024-01-21'),
    total: 640,
    method: 'cash',
    status: 'completed',
    items: [
      { productId: '2', quantity: 2, price: 320 }
    ]
  },
  {
    id: 'ORD003',
    date: new Date('2024-01-21'),
    total: 840,
    method: 'transfer',
    status: 'pending',
    items: [
      { productId: '3', quantity: 3, price: 280 }
    ]
  }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      products: mockProducts,
      orders: mockOrders,
      
      addProduct: (productData) => set((state) => ({
        products: [
          ...state.products,
          {
            ...productData,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      })),
      
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map((product) =>
          product.id === id
            ? { ...product, ...updates, updatedAt: new Date() }
            : product
        )
      })),
      
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((product) => product.id !== id)
      })),
      
      addOrder: (orderData) => set((state) => ({
        orders: [
          ...state.orders,
          {
            ...orderData,
            id: generateId()
          }
        ]
      })),
      
      updateOrder: (id, updates) => set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? { ...order, ...updates } : order
        )
      }))
    }),
    {
      name: 'store'
    }
  )
);