class Socket {
  init() {
    return io("http://localhost:3000", {
      transports: ["websocket"],
      path: "/chat",
    });
  }
}
