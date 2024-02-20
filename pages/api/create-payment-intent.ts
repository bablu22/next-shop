"use server";

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { options } from "./auth/[...nextauth]";
import { ICartTypes } from "@/types/cartTypes";
import { prisma } from "@/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

const calculateTotalPrice = (items: ICartTypes[]) => {
  return items.reduce((acc, item) => {
    return acc + (item.price || 0) * (item.quantity || 0);
  }, 0);
};

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userSession = await getServerSession(req, res, options);
    if (!userSession || !userSession.user) {
      return res.status(403).json({ message: "You are unauthorized" });
    }

    const { items, payment_intent_id } = req.body;
    console.log(payment_intent_id);

    const orderData = {
      user: { connect: { id: userSession.user.id } },
      amount: calculateTotalPrice(items),
      currency: "USD",
      status: "pending",
      paymentIntentId: payment_intent_id,
      products: {
        create: items.map((item: ICartTypes) => ({
          name: item.name,
          price: parseFloat(String(item.price || 0)),
          image: item.image,
          quantity: item.quantity,
        })),
      },
    };

    if (payment_intent_id && payment_intent_id !== null) {
      const current_intent = await stripe.paymentIntents.retrieve(
        payment_intent_id
      );

      if (current_intent) {
        const update_intent = await stripe.paymentIntents.update(
          payment_intent_id,
          {
            amount: calculateTotalPrice(items),
          }
        );

        console.log("update indent", update_intent);

        const existingOrder = await prisma.order.findFirst({
          where: { paymentIntentId: update_intent?.id },
          include: { products: true },
        });

        if (!existingOrder) {
          res.status(400).json({ message: "Invalid payment intent" });
        }
        console.log("existing:", existingOrder);

        const updatedOrder = await prisma.order.update({
          where: { id: existingOrder?.id },
          data: {
            amount: calculateTotalPrice(items),
            products: {
              deleteMany: {},
              create: items.map((item: ICartTypes) => ({
                name: item.name,
                price: parseFloat(String(item.price || 0)),
                image: item.image,
                quantity: item.quantity,
              })),
            },
          },
        });
        console.log("updated", updatedOrder);

        return res.status(200).json({ paymentIndent: update_intent });
      }
    } else {
      const paymentIndent = await stripe.paymentIntents.create({
        amount: calculateTotalPrice(items),
        currency: "usd",
        automatic_payment_methods: { enabled: true },
      });

      const newOrder = await prisma.order.create({
        data: {
          ...orderData,
          paymentIntentId: paymentIndent.id,
        },
      });
      console.log("created", newOrder);

      return res.status(200).json({ paymentIndent });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
