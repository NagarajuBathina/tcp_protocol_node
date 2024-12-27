const express = require("express");
const app = express();
const net = require("net");
const crypto = require("crypto");

// Middleware for parsing JSON
app.use(express.json());

// In-memory data storage
const dataStorage = new Map();

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

server.on("connection", (socket) => {
  const remoteAddress = socket.remoteAddress + ":" + socket.remotePort;
  console.log("New client connection from %s", remoteAddress);

  // Handle incoming data
  // socket.on("data", (data) => {
  //   const receivedData = data.toString();
  //   console.log("Data from %s: %s", remoteAddress, receivedData);

  //   // Validate and parse the input
  //   console.log("Received data: %s", receivedData);
  //   const match = receivedData.match(/^dr:([^:]+):([^:]+):([^:]+):([^:]+)\r\n$/i);
  //   console.log("Match: %s", match);
  //   if (match) {
  //     const macId = match[1];
  //     console.log("macId: %s", macId);
  //     const fw = match[2];
  //     console.log("fw: %s", fw);
  //     const hw = match[3];
  //     console.log("hw: %s", hw);
  //     const pid = match[4];
  //     console.log("pid: %s", pid);

  //     // Generate unique ID and timestamp
  //     const uniqueId = crypto.randomUUID();
  //     console.log("Unique ID: %s", uniqueId);
  //     const timestamp = Date.now();
  //     console.log("Timestamp: %s", timestamp);

  //     // Store the parsed data
  //     dataStorage.set(uniqueId, { macId, fw, hw, pid, timestamp });
  //     console.log("Stored data for ID: %s", uniqueId);

  //     // Respond to the client
  //     const response = `DR:${uniqueId}:${timestamp}\r\n`;
  //     socket.write(response);
  //   } else {
  //     console.error("Invalid data format from %s: %s", remoteAddress, receivedData);
  //     socket.write("ERROR:INVALID_FORMAT\r\n");
  //   }
  // });

  socket.on("data", (data) => {
    const receivedData = data.toString();
    console.log("Raw data (buffer):", data);
    console.log("Data received: %s", receivedData);
  
    // Sanitize data
    const sanitizedData = receivedData.replace(/\\r\\n$/, "\r\n");
    console.log("Sanitized data: %s", sanitizedData);
  
    // Match sanitized data
    const match = sanitizedData.match(/^dr:([^:]+):([^:]+):([^:]+):([^:]+)\r\n$/i);
    if (match) {
      const macId = match[1];
      const fw = match[2];
      const hw = match[3];
      const pid = match[4];
  
      // Log details
      console.log("Parsed Data -> macId: %s, fw: %s, hw: %s, pid: %s", macId, fw, hw, pid);
  
      const uniqueId = crypto.randomUUID();
      const timestamp = Date.now();
      console.log("timestamp: %s", timestamp);
      dataStorage.set(uniqueId, { macId, fw, hw, pid, timestamp });
  
      const response = `DR:${uniqueId}:${timestamp}\r\n`;
      socket.write(response);
    } else {
      console.error("Invalid data format: %s", receivedData);
      socket.write("ERROR:INVALID_FORMAT\r\n");
    }
  });
  

  // Handle connection close
  socket.once("close", () => {
    console.log("Connection from %s closed", remoteAddress);
  });

  // Handle errors
  socket.on("error", (err) => {
    console.log("Connection error with %s: %s", remoteAddress, err.message);
  });
});

// Start TCP Server
server.listen(tcpPort, () => {
  console.log(`TCP server listening on port ${tcpPort}`);
});

