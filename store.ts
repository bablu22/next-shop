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
          const existingItem = state.cart.find((c) => c.id === item.id);
          if (existingItem) {
            return {
              ...state,
              cart: state.cart.map((c) =>
                c.id === existingItem.id
                  ? { ...c, quantity: c.quantity + (item.quantity || 1) }
                  : c
              ),
            };
          }
          return {
            cart: [
              ...state.cart,
              {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity || 1,
              },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => {
          const existingItem = state.cart.find((c) => c.id === id);
          if (existingItem && existingItem.quantity! > 1) {
            const updateCart = state.cart.map((c) => {
              return c.id === existingItem.id
                ? { ...c, quantity: c.quantity - 1 }
                : c;
            });
            return {
              cart: updateCart,
            };
          } else {
            const cartFiltered = state.cart.filter((c) => c.id !== id);
            return {
              ...state,
              cart: cartFiltered,
            };
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
