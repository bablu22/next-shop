import { useCartStore } from "@/store";
import formatPrice from "@/utils/formatPrice";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const cartStore = useCartStore();

  const totalPrice = cartStore.cart.reduce((acc, item) => {
    return acc + item.price! * item.quantity!;
  }, 0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    setLoading(false);

    if (error) {
      console.error("Payment failed:", error);
    } else {
      if (paymentIntent?.status === "succeeded") {
        cartStore.setOnCheckout("success");
      }
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <button
        className="bg-gray-900 text-white p-2 w-full my-2 rounded-md"
        onClick={() => {
          cartStore.setOnCheckout("cart");
        }}
      >
        Continue shopping
      </button>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <div className="flex my-4 justify-between text-base font-medium text-gray-900">
        <p>Total</p>
        <p>{formatPrice(totalPrice)}</p>
      </div>
      <button
        id="submit"
        type="submit"
        className="w-full flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-6 py-2 text-base font-medium text-white "
        disabled={loading || !stripe || !elements}
      >
        {loading ? "Loading..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
