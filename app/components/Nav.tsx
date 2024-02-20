"use client";

import { useCartStore } from "@/store";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Cart from "./Cart";
import { AnimatePresence, motion } from "framer-motion";

export default function Nav({ user }: Session) {
  const cartStore = useCartStore();
  return (
    <nav className=" bg-gray-900 text-white">
      <div className="py-4 sm:px-10 px-6 container mx-auto flex  justify-between items-center">
        <Link href="/">
          <h1 className="font-bold text-xl">NextShop 💥</h1>
        </Link>
        <ul className="flex items-center gap-5 ">
          <li>
            <button onClick={() => cartStore.toggleCart()}>
              <i className="ri-shopping-bag-line text-3xl relative">
                <AnimatePresence>
                  {cartStore.cart.length > 0 && (
                    <motion.span
                      animate={{
                        scale: 1,
                      }}
                      initial={{
                        scale: 0,
                      }}
                      className="absolute bg-teal-600 w-5 h-5 rounded-full text-sm left-4 bottom-4 flex items-center justify-center"
                    >
                      {cartStore.cart.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </i>
            </button>
          </li>
          {!user && (
            <div>
              <li className="bg-teal-600 text-white py-1 px-4 rounded-md">
                <button
                  onClick={() => {
                    signIn();
                  }}
                >
                  Sign in
                </button>
              </li>
            </div>
          )}
          {user && (
            <>
              <div className="dropdown cursor-pointer dropdown-end">
                <Image
                  src={user?.image as string}
                  width={40}
                  height={40}
                  alt={user.name as string}
                  className="rounded-full"
                  tabIndex={0}
                />
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 text-gray-900 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link
                      href={"/dashboard"}
                      onClick={() => {
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                      }}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className=" text-rose-600 font-bold  rounded-md">
                    <button
                      onClick={() => {
                        signOut();
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                      }}
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </ul>
      </div>
      <AnimatePresence>{cartStore.isOpen && <Cart />}</AnimatePresence>
    </nav>
  );
}
