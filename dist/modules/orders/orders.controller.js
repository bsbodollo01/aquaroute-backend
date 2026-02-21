"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.orderSummary = exports.createOrder = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOrder = async (req, res) => {
    const { sellerId, quantity } = req.body;
    const order = await prisma.order.create({
        data: {
            buyerId: req.user.id,
            sellerId,
            quantity
        }
    });
    res.json(order);
};
exports.createOrder = createOrder;
const orderSummary = async (req, res) => {
    try {
        const userId = req.user.id;
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.orderSummary = orderSummary;
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status }
    });
    res.json(order);
};
exports.updateOrderStatus = updateOrderStatus;
