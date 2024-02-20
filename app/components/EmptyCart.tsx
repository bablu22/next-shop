"use client";
import { motion } from "framer-motion";
import cart from "@/public/cart.json";
import Link from "next/link";

import { Player } from "@lottiefiles/react-lottie-player";

const EmptyCart = () => {
  return (
    <div className="flex items-center justify-center flex-col mt-20">
      <Player
        autoplay
        loop
        src={cart}
        style={{ height: "300px", width: "300px" }}
      ></Player>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.5,
        }}
        className="text-xl font-bold text-gray-800"
      >
        Cart is empty
      </motion.h1>
    </div>
  );
};

export default EmptyCart;
