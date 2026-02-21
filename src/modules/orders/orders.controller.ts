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
  try {
    const userId = (req.user as { id: string; role: "BUYER" | "SELLER" }).id;

    const seller = await prisma.seller.findFirst({
      where: { userId }
    });

    // ✅ Handle null seller properly
    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    const pending = await prisma.order.count({
      where: { sellerId: seller.id, status: "PENDING" }
    });

    const delivered = await prisma.order.count({
      where: { sellerId: seller.id, status: "DELIVERED" }
    });

    return res.json({
      pending,
      delivered
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id: req.params.id as string },
    data: { status }
  });

  res.json(order);
};
