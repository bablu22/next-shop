"use server";

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { options } from "./auth/[...nextauth]";
import { prisma } from "@/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const user = await getServerSession(req, res, options);
      if (!user) {
        return res.status(403).json({ message: "You are unauthorized" });
      }
      const orders = await prisma.order.findMany({
        where: { user: { id: user?.user?.id } },
        include: { products: true },
      });
      return res.status(200).json(orders);
    } else {
      res.setHeader("Allow", "GET");
      return res.status(405).end("Method Not Allowed");
    }
  } catch (error: any) {
    throw new Error(error);
  }
}
