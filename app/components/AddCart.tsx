"use client";

import { useCartStore } from "@/store";
import { ICartTypes } from "@/types/cartTypes";
import { useState } from "react";

const AddCart = ({ name, id, image, price }: ICartTypes) => {
  const [quantity, setQuantity] = useState<number>(1);

  const cartStore = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) =>
      prevQuantity - 1 >= 0 ? prevQuantity - 1 : 0
    );
  };
  return (
    <>
      <div className="flex flex-wrap items-center mb-6">
        <div className="mb-4 mr-4 lg:mb-0">
          <div className="w-28">
            <div className="relative flex flex-row w-full h-10 bg-transparent rounded-lg">
              <button
                onClick={decreaseQuantity}
                className="w-20 h-full text-gray-600 bg-gray-100 border-r rounded-l outline-none cursor-pointer dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 hover:text-gray-700 dark:bg-gray-900 hover:bg-gray-300"
              >
                <span className="m-auto text-2xl font-thin">-</span>
              </button>
              <input
                type="text"
                className="flex items-center w-full font-semibold text-center text-gray-700 placeholder-gray-700 bg-gray-100 outline-none dark:text-gray-400 dark:placeholder-gray-400 dark:bg-gray-900 focus:outline-none text-md hover:text-black"
                placeholder="1"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              />
              <button
                onClick={increaseQuantity}
                className="w-20 h-full text-gray-600 bg-gray-100 border-l rounded-r outline-none cursor-pointer dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 dark:bg-gray-900 hover:text-gray-700 hover:bg-gray-300"
              >
                <span className="m-auto text-2xl font-thin">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() =>
            cartStore.addItem({
              id: id,
              name: name,
              image: image,
              price: price,
              quantity: quantity,
            })
          }
          className="w-full px-4 py-2 text-center text-gray-100 bg-teal-600 border border-transparent  rounded-lg"
        >
          Add to cart
        </button>
      </div>
    </>
  );
};

export default AddCart;
