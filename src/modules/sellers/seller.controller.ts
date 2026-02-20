import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { haversine } from "../../utils/distance";

const prisma = new PrismaClient();

export const nearbySellers = async (req: Request, res: Response) => {
  const { lat, lng, radius = 5 } = req.query;

  const sellers = await prisma.seller.findMany({
    where: { isActive: true }
  });

  const nearby = sellers.filter((s: typeof sellers[number]) => {
    const dist = haversine(
      Number(lat),
      Number(lng),
      s.latitude,
      s.longitude
    );
    return dist <= Number(radius);
  });

  res.json(nearby);
};
