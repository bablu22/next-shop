"use client";

import { useCartStore } from "@/store";
import formatPrice from "@/utils/formatPrice";
import Image from "next/image";
import busket from "@/public/basket.png";
import { AnimatePresence, motion } from "framer-motion";
import Checkout from "./Checkout";
import OrderConfirmed from "./OrderConfirmed";
import EmptyCart from "./EmptyCart";

const Cart = () => {
  const cartStore = useCartStore();
  const totalPrice = cartStore.cart.reduce((acc, item) => {
    return acc + item.price! * item.quantity!;
  }, 0);

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="relative z-10"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2
                      className="text-lg font-medium text-gray-900"
                      id="slide-over-title"
                    >
                      Shopping cart
                    </h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        onClick={() => cartStore.toggleCart()}
                        type="button"
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5"></span>
                        <span className="sr-only">Close panel</span>
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <motion.ul
                        transition={{
                          opacity: { ease: "linear" },
                          layout: { duration: 0.3 },
                        }}
                        role="list"
                        className="-my-6 divide-y divide-gray-200"
                      >
                        {cartStore.onCheckout === "cart" && (
                          <>
                            {cartStore.cart.map((cart) => (
                              <motion.li
                                layout
                                className="flex py-6"
                                key={cart.id}
                              >
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <Image
                                    src={cart.image}
                                    height={800}
                                    width={800}
                                    placeholder="blur"
                                    blurDataURL={cart.image}
                                    alt={cart.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3 className="text-sm">
                                        <a href="#">{cart.name}</a>
                                      </h3>
                                      <p className="ml-4">
                                        {formatPrice(cart.price as number)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                      Qty {cart.quantity}
                                    </p>

                                    <div className="flex items-center space-x-3">
                                      <button
                                        onClick={() =>
                                          cartStore.removeItem(cart.id)
                                        }
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                      >
                                        <i className="ri-subtract-line"></i>
                                      </button>
                                      <button
                                        onClick={() =>
                                          cartStore.addItem({
                                            ...cart,
                                            quantity: 1,
                                          })
                                        }
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                      >
                                        <i className="ri-add-circle-line"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.li>
                            ))}
                            {!cartStore.cart.length && <EmptyCart />}
                          </>
                        )}

                        {cartStore.onCheckout === "checkout" && (
                          <motion.div className="">
                            <Checkout />
                          </motion.div>
                        )}
                        {cartStore.onCheckout === "success" && (
                          <OrderConfirmed />
                        )}
                      </motion.ul>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {cartStore.cart.length > 0 &&
                  cartStore.onCheckout === "cart" ? (
                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      {cartStore.onCheckout === "cart" && (
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>{formatPrice(totalPrice)}</p>
                        </div>
                      )}
                      <div className="mt-6">
                        <button
                          onClick={() => cartStore.setOnCheckout("checkout")}
                          className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
