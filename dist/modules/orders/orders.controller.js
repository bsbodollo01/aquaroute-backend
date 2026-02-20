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
    const seller = await prisma.seller.findFirst({
        where: { userId: req.user.id }
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
