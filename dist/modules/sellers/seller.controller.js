"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearbySellers = void 0;
const client_1 = require("@prisma/client");
const distance_1 = require("../../utils/distance");
const prisma = new client_1.PrismaClient();
const nearbySellers = async (req, res) => {
    const { lat, lng, radius = 5 } = req.query;
    const sellers = await prisma.seller.findMany({
        where: { isActive: true }
    });
    const nearby = sellers.filter((s) => {
        const dist = (0, distance_1.haversine)(Number(lat), Number(lng), s.latitude, s.longitude);
        return dist <= Number(radius);
    });
    res.json(nearby);
};
exports.nearbySellers = nearbySellers;
