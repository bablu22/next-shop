import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const buf = await buffer(req);
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      return res.status(400).json({ message: "No signature provided" });
    }

    let event: Stripe.Event;

    event = stripe.webhooks.constructEvent(
      buf.toString(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_KEY as string
    );

    switch (event.type) {
      case "payment_intent.created":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(paymentIntent);
        break;

      case "charge.succeeded":
        const charge = event.data.object as Stripe.Charge;
        if (charge.payment_intent) {
          const order = await prisma.order.update({
            where: {
              paymentIntentId: charge.payment_intent as string,
            },
            data: {
              status: "complete",
            },
          });
        }
        break;
      default:
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
