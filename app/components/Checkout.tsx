"use client";

import { useCartStore } from "@/store";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import OrderAnimation from "./OrderAnimation";
import { signIn } from "next-auth/react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Checkout = () => {
  const cartStore = useCartStore();
  const [clientSecret, setClientSecret] = useState("");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartStore.cart,
        payment_intent_id: cartStore.paymentIndent,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 403) {
          setError("Please login first");
          throw new Error("Unauthorized");
        }
      })
      .then((data) => {
        setClientSecret(data.paymentIndent.client_secret);
        cartStore.setPaymentIntent(data.paymentIndent.id);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  return (
    <div className="">
      {error ? (
        <div className="text-gray-900 flex items-center justify-center flex-col mt-24 ">
          <h1 className="text-xl font-bold">{error}</h1>
          <div className="bg-teal-600 text-white py-1 px-4 rounded-md mt-10">
            <button
              onClick={() => {
                signIn();
              }}
              className=""
            >
              Sign in
            </button>
          </div>
        </div>
      ) : (
        <>
          {!clientSecret && <OrderAnimation />}
          {clientSecret && (
            <div>
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm clientSecret={clientSecret} />
              </Elements>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Checkout;
