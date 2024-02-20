import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ICartTypes } from "./types/cartTypes";

export interface CartItem {
  id: string;
  name: string;
  price: number | null;
  image: string;
  quantity: number;
}

type CartState = {
  isOpen: boolean;
  cart: CartItem[];
  toggleCart: () => void;
  addItem: (item: ICartTypes) => void;
  removeItem: (id: string) => void;
  paymentIndent: string | null;
  setPaymentIntent: (val: string) => void;
  onCheckout: string;
  setOnCheckout: (val: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isOpen: false,
      onCheckout: "cart",
      setOnCheckout: (val) => set((state) => ({ onCheckout: val })),
      toggleCart: () =>
        set((state) => ({
          isOpen: !state.isOpen,
        })),
      addItem: (item: ICartTypes) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (c) => c.id === item.id
          );
          if (existingItemIndex !== -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingItemIndex].quantity += 1;
            return { cart: updatedCart };
          } else {
            const newItem: CartItem = {
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: 1,
            };
            return { cart: [...state.cart, newItem] };
          }
        }),

      removeItem: (id) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex((c) => c.id === id);
          if (existingItemIndex !== -1) {
            const updatedCart = [...state.cart];
            if (updatedCart[existingItemIndex].quantity > 1) {
              updatedCart[existingItemIndex].quantity -= 1;
            } else {
              updatedCart.splice(existingItemIndex, 1);
            }
            return { cart: updatedCart };
          } else {
            return { cart: state.cart };
          }
        }),
      paymentIndent: null,
      setPaymentIntent: (val) => set((state) => ({ paymentIndent: val })),
      clearCart: () => set((state) => ({ cart: [] })),
    }),
    {
      name: "cart-store",
    }
  )
);
