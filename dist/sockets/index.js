"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: { origin: "*" }
    });
    io.on("connection", socket => {
        socket.on("join-order", orderId => {
            socket.join(orderId);
        });
        socket.on("location-update", data => {
            io.to(data.orderId).emit("location-update", data);
        });
    });
};
exports.initSocket = initSocket;
