const express = require("express");
const app = express();
const net = require("net");

// Middleware for parsing JSON
app.use(express.json());

// Express HTTP Route
app.get("/", (req, res) => {
  res.send("Hello, this is a TCP protocol server running alongside HTTP!");
});

// Start Express HTTP Server
const httpPort = 3000;
app.listen(httpPort, () => {
  console.log(`HTTP server running at http://localhost:${httpPort}`);
});

// TCP Server
const tcpPort = 9000;
const server = net.createServer();

server.on("connection", function (socket) {
  const remoteAddress = socket.remoteAddress + ":" + socket.remotePort;
  console.log("New client connection from %s", remoteAddress);

  // Handle incoming data
  socket.on("data", function (data) {
    console.log("Data from %s: %s", remoteAddress, data.toString());
    socket.write("hello " + data);
  });

  // Handle connection close
  socket.once("close", function () {
    console.log("Connection from %s closed", remoteAddress);
  });

  // Handle errors
  socket.on("error", function (err) {
    console.log("Connection error with %s: %s", remoteAddress, err.message);
  });
});

// Start TCP Server
server.listen(tcpPort, () => {
  console.log(`TCP server listening on port ${tcpPort}`);
});
