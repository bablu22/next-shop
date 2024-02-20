"use client";

import { useCartStore } from "@/store";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import OrderAnimation from "./OrderAnimation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Checkout = () => {
  const cartStore = useCartStore();
  const [clientSecret, setClientSecret] = useState("");
  const router = useRouter();

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
          router.push("/api/auth/signin");
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
      {!clientSecret && <OrderAnimation />}
      {clientSecret && (
        <div>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default Checkout;
