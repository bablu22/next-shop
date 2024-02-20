"use client";
import { motion } from "framer-motion";
import chacked from "@/public/success.json";
import Link from "next/link";
import { useCartStore } from "@/store";
import { useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

const OrderConfirmed = () => {
  const cartStore = useCartStore();

  useEffect(() => {
    cartStore.setPaymentIntent("");
    cartStore.clearCart();
  }, []);
  return (
    <div className="flex items-center justify-center flex-col mt-24">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.5,
        }}
        className="text-xl font-bold text-gray-800"
      >
        Order complete ✔
      </motion.h1>
      <Player
        autoplay
        loop
        src={chacked}
        style={{ height: "300px", width: "300px" }}
      ></Player>
      <Link
        href={"/dashboard"}
        className="bg-gray-800 text-white p-2 w-full text-center rounded-md"
        onClick={() => {
          setTimeout(() => {
            cartStore.setOnCheckout("cart");
          }, 1000);
          cartStore.toggleCart();
        }}
      >
        Check order
      </Link>
    </div>
  );
};

export default OrderConfirmed;
