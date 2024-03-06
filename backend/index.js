const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const cors = require("cors"); // cors modülünü buraya ekleyin

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(
  cors({
    origin: "http://localhost:3000", // React uygulamasının bulunduğu adres
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Diğer kodlar buraya gelmeli...

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
