"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function SocketTestPage() {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to Socket.IO:", socket.id);
    });

    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-10">
      <h1>Socket.IO Test</h1>
    </div>
  );
}