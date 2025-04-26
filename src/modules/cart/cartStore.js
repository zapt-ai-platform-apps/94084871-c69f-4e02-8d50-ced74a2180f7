import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      prescription: null,
      
      // Add item to cart
      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (cartItem) => cartItem.id === item.id
          );
          
          if (existingItemIndex > -1) {
            // Item exists, update quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return { items: updatedItems };
          } else {
            // Item doesn't exist, add new item
            return { 
              items: [...state.items, { ...item, quantity }] 
            };
          }
        });
      },
      
      // Update item quantity
      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }));
      },
      
      // Remove item from cart
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId)
        }));
      },
      
      // Add prescription to cart
      setPrescription: (prescription) => {
        set({ prescription });
      },
      
      // Clear prescription
      clearPrescription: () => {
        set({ prescription: null });
      },
      
      // Clear cart
      clearCart: () => {
        set({ items: [], prescription: null });
      },
      
      // Get cart totals
      getCartTotals: () => {
        const items = get().items;
        const subtotal = items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        
        // Calculate shipping (free over $50)
        const shipping = subtotal > 50 ? 0 : 5.99;
        
        // Calculate tax (assume 8%)
        const tax = subtotal * 0.08;
        
        // Calculate total
        const total = subtotal + shipping + tax;
        
        return {
          subtotal,
          shipping,
          tax,
          total
        };
      },
      
      // Check if cart has prescription-required items
      hasPrescriptionRequiredItems: () => {
        return get().items.some(item => item.requiresPrescription);
      },
      
      // Get number of items in cart
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'medstore-cart',
      partialize: (state) => ({ items: state.items, prescription: state.prescription }),
    }
  )
);