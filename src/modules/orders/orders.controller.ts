import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createOrder = async (req: Request<any, any, { sellerId: string; quantity: number }>, res: Response) => {
  const { sellerId, quantity } = req.body;

  const order = await prisma.order.create({
    data: {
      buyerId: (req.user as { id: string; role: "BUYER" | "SELLER" }).id,
      sellerId,
      quantity
    }
  });

  res.json(order);
};

export const orderSummary = async (req: Request, res: Response) => {
  const seller = await prisma.seller.findFirst({
    where: { userId: (req.user as { id: string; role: "BUYER" | "SELLER" }).id }
  });

  const summary = {
    pending: await prisma.order.count({
      where: { sellerId: seller.id, status: "PENDING" }
    }),
    delivered: await prisma.order.count({
      where: { sellerId: seller.id, status: "DELIVERED" }
    })
  };

  res.json(summary);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status }
  });

  res.json(order);
};
