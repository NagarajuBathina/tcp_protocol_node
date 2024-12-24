const express = require("express");
const app = express();
app.use(express);
var net = require("net");

var server = net.createServer();

server.on("connection", function (socket) {
  var remoteAddress = socket.remoteAddress + ":" + socket.remotePort;
  console.log("new client connection is made %s", remoteAddress);

  socket.on("data", function (d) {
    console.log("data from %s : %s", remoteAddress, d);
    socket.write("hello" + d);
  });

  socket.once("close", function () {
    console.log("connection from %s closed", remoteAddress);
  });

  socket.on("error", function (err) {
    console.log("connection %s error: %s", remoteAddress, err.message);
  });
});

server.listen(9000, function () {
  console.log("server listening to %j", server.address());
});
