const getAllCustomers = require("./functions/getAllCustomers");
const sendCustomer = require("./functions/sendCustomer");
const sendCustomerUpdateRequest = require("./functions/selectedCustomer");
const sendLoginRequest = require("./functions/logIn");

let customerList = [];

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use((req, res, next) => {
  console.log("middleware");
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

io.on("connection", (socket) => {
  socket.on("message", async (data) => {
    console.log(data.message);
    const messages = [
      { x: "merhaba", y: "merhaba! hoşgeldin." },
      {
        x: "nasılsın",
        y: "iyiyim, teşekkür ederim. size nasıl yardımcı olabilirim?",
      },
      { x: "adın ne", y: "aris888" },
    ];

    const answer = messages.find((message) => message.x === data.message);
    if (answer) {
      socket.emit("message", {
        id: socket.id,
        date: Date.now(),
        message: answer.y,
      });
    } else {
      const createAnswer = await getAnswer(data.message);
      if (createAnswer.message === "OK")
        return socket.emit("message", {
          id: socket.id,
          date: Date.now(),
          message: createAnswer.data,
        });

      socket.emit("message", {
        id: socket.id,
        date: Date.now(),
        message: "I do not understand",
      });
    }
  });

  socket.on("request", async (data) => {
    if (data?.message === "temsilci") {
      customerList.push(socket.id);
      console.log("customerList", customerList);
    }
  });
  socket.on("Livemessage", async (data) => {
    console.log("liveChat dn gelen msaj" + data.userName);

    // Diğer işlemlerinizi gerçekleştirebilirsiniz.

    // Gelen mesajı yayınla
    io.emit("Livemessage", {
      id: socket.id,
      sender: "customer",
      date: Date.now(),
      message: data.message,
      userName: data.userName,
      roomId: data.roomId,
    });
  });
  socket.on("supportLiveChat", async (data) => {
    console.log("supportliveChat dn gelen msaj" + data.message);

    // Gelen mesajı yayınla
    io.emit("supportLiveChat", {
      id: socket.id,
      sender: "support",
      date: Date.now(),
      message: data.message,
      userName: data.userName,
    });
    console.log(data.userName);
  });

  socket.on("formData", async (data) => {
    console.log("formdata", data);
    try {
      // Form verilerini API'ye gönder
      const responseData = await sendCustomer(data);
      return responseData;
    } catch (error) {
      console.error("Error while sending data to API:", error);
    }
  });

  async function allCustomers() {
    try {
      const allCustomers = await getAllCustomers();
      console.log("All customers:", allCustomers);
      io.emit("allCustomers", {
        id: allCustomers.id,
        name: allCustomers.name,
        email: allCustomers.email,
        phone: allCustomers.phone,
        roomId: allCustomers.roomId,
        supporterId: allCustomers.supporterId,
        status: allCustomers.status,
      });
    } catch (error) {
      console.error("Error while fetching customers:", error);
    }
  }

  // main fonksiyonunu çağırarak işlemi başlatın
  allCustomers();

  socket.on("selectedCustomer", async (data) => {
    console.log("seçilen müşteri", data);
    // gelen bilgiler
    const { customerId, supporterId, status } = data;
    // API isteği gönder
    await sendCustomerUpdateRequest(customerId, supporterId, status);
  });

  socket.on("logIn", async (data) => {
    try {
      const { email, password } = data;

      // Login isteğini yap
      const loginResponse = await sendLoginRequest(email, password);

      // Login yanıtını emit et
      socket.emit("logIn", loginResponse);
    } catch (error) {
      console.error("Error during login:", error);
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3005, () => {
  console.log("listening on http://localhost:3005");
});

async function getAnswer(message) {
  const data = await fetch("https://aris888.io/api/ai/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: "9a78f4b-1d5b8d48*b6ac5f86a-*0f9-f5f44f85*0e",
      message: message,
    }),
  }).then((response) => response.json());

  return data;
}
