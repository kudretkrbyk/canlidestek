const getAllCustomers = require("./functions/getAllCustomers");
const sendCustomer = require("./functions/sendCustomer");
//const sendCustomerUpdateRequest = require("./functions/selectedCustomer");
const sendLoginRequest = require("./functions/logIn");
const updateCustomer = require("./functions/updateCustomers");
const sendMessages = require("./functions/sendMessages");
//const createSupporterModule = require("./functions/createSupporter");
//const getSupporter = require("./functions/getSupporter");

let customerList = [];
let formDataName = [];
let supporterId = null;
let selectedCustomer = [];

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
    console.log("liveChat dn gelen msaj111", data);

    const requestData = {
      id: data.id,
      sender: data.sender,
      date: data.date,
      message: data.message,
      userName: data.userName,
      roomId: data.roomId, // roomId olarak düzeltilmiş
    };

    try {
      // İsteği gönder
      await sendMessages(data.roomID, requestData);
    } catch (error) {
      console.error("İstek hatası mesaj ekleme:", error);
      // Hata durumunda isteği yeniden deneyebilir veya başka bir işlem yapabilirsiniz
    }

    // Gelen mesajı yayınla
    io.emit("Livemessage", {
      id: data.id,
      sender: data.sender,
      date: data.date,
      message: data.message,
      userName: data.userName,
      roomId: data.roomId,
    });
  });
  socket.on("supportLiveChat", async (data) => {
    console.log("supportliveChat dn gelen msaj", data);

    // Gelen mesajı yayınla
    io.emit("supportLiveChat", {
      id: data.supporterId,
      sender: "support",
      date: data.date,
      message: data.message,
      userName: data.userName,
      roomID: data.roomID,
    });
    console.log(data.userName);
  });

  socket.on("formData", async (data) => {
    formDataName = { name: data.name, roomId: data.roomId };
    console.log("formdata", data);
    try {
      // Form verilerini API'ye gönder
      const responseData = await sendCustomer(data);
      return responseData;
    } catch (error) {
      console.error("Error while sending data to API:", error);
    }
  });
  socket.emit("formData", formDataName);

  async function allCustomers() {
    try {
      const allCustomers = await getAllCustomers();
      //console.log("All customers:", allCustomers);
      // const formattedCustomers = allCustomers.map((customer) => ({
      //   id: customer.id,
      //   name: customer.name,
      //   email: customer.email,
      //   phone: customer.phone,
      //   roomId: customer.roomId,
      //   supporterId: customer.supporterId,
      //   status: customer.status,
      // }));
      //console.log("formatted list", formattedCustomers[1]);

      // Emit işlemi gerçekleştir
      io.emit("allCustomers", allCustomers);
    } catch (error) {
      console.error("Error while fetching customers:", error);
    }
  }

  // main fonksiyonunu çağırarak işlemi başlatın
  allCustomers();

  // async function createSupport() {
  //   try {
  //     await createSupporterModule();
  //   } catch (error) {
  //     console.error("supporter create error:", error);
  //   }
  // }

  //createSupport();

  socket.on("selectedCustomer", async (selectedCustomerFrontend) => {
    console.log("seçilen müşteriaaa", selectedCustomerFrontend);
    selectedCustomer = selectedCustomerFrontend;
    //gelen bilgiler

    //aPI isteği gönder

    await updateCustomer({
      id: selectedCustomerFrontend.id,
      status: selectedCustomerFrontend.status,
      supporterId: selectedCustomerFrontend.supporterId,
    });
  });
  socket.emit("selectedCustomer", selectedCustomer);
  socket.on("logIn", async (data) => {
    try {
      const { email, password } = data;

      // Login isteğini yap
      const loginResponse = await sendLoginRequest(email, password);

      // Login yanıtını emit et
      socket.emit("logIn", loginResponse);
      console.log("id kontrol", loginResponse.data.id);
    } catch (error) {
      console.error("Error during login:", error);
    }
  });

  socket.on("log", async (data) => {
    supporterId = data;
  });
  if (supporterId !== null) {
    socket.emit("log", supporterId);
    console.log(" LOG emit destek Idsi", supporterId);
  }
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
