import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  items: CartItem[]
  total: number
  paymentMethod: string
  timestamp: string
}

interface StoreState {
  cart: CartItem[]
  orders: Order[]
  addToCart: (productId: string, name: string, price: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: () => number
  cartItemCount: () => number
  createOrderFromCart: (paymentMethod: string) => void
}

export const useStore = create<StoreState>()(
  subscribeWithSelector((set, get) => ({
    cart: [],
    orders: [],
    
    addToCart: (productId: string, name: string, price: number) => {
      set((state) => {
        const existingItem = state.cart.find(item => item.productId === productId)
        
        if (existingItem) {
          return {
            cart: state.cart.map(item =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          }
        } else {
          return {
            cart: [...state.cart, { productId, name, price, quantity: 1 }]
          }
        }
      })
    },
    
    removeFromCart: (productId: string) => {
      set((state) => ({
        cart: state.cart.filter(item => item.productId !== productId)
      }))
    },
    
    updateQuantity: (productId: string, quantity: number) => {
      if (quantity <= 0) {
        get().removeFromCart(productId)
        return
      }
      
      set((state) => ({
        cart: state.cart.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        )
      }))
    },
    
    clearCart: () => {
      set({ cart: [] })
    },
    
    cartTotal: () => {
      return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    
    cartItemCount: () => {
      return get().cart.reduce((total, item) => total + item.quantity, 0)
    },
    
    createOrderFromCart: (paymentMethod: string) => {
      const { cart } = get()
      const total = get().cartTotal()
      
      const order: Order = {
        id: `order_${Date.now()}`,
        items: [...cart],
        total,
        paymentMethod,
        timestamp: new Date().toISOString()
      }
      
      set((state) => ({
        orders: [...state.orders, order]
      }))
      
      console.log('Order created:', order)
    }
  }))
)