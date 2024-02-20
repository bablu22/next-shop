import { motion } from "framer-motion";
import order from "@/public/order.json";
import { Player } from "@lottiefiles/react-lottie-player";

const OrderAnimation = () => {
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
        Preparing Order 💥
      </motion.h1>
      <Player
        autoplay
        loop
        src={order}
        style={{ height: "300px", width: "300px" }}
      ></Player>
    </div>
  );
};

export default OrderAnimation;
