import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
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
