import React, { useState, useEffect } from "react";
import { BroadcastChannel } from "broadcast-channel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import customerMessageStore from "./Store";
import { io } from "socket.io-client";
import authStore from "./supporterIdStore";

const URL = "http://localhost:3005";
let initialMessage = "";

const LiveChat = ({ liveChat }) => {
  const { liveChatList, addLiveChatList } = customerMessageStore();
  const [message, setMessage] = useState("");
  const { roomId, setRoomId } = customerMessageStore();

  const { supporterId, login } = authStore();
  const [socket, setSocket] = useState(null);
  //const [setSelectedCustomerUpdated] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [selected, setSelected] = useState();
  const [textAreaReadOnly, setTextareaReadOnly] = useState(true);

  useEffect(() => {
    const socket = io.connect(URL, { transports: ["websocket"] });
    setSocket(socket);

    // Bağlantı kurulduğunda
    socket.on("connect", () => {
      console.log("Bağlantı kuruldu livechat", socket);
    });

    // Bağlantı kapatıldığında
    socket.on("disconnect", () => {
      console.log("Bağlantı kapatıldı");
    });

    // Hata durumunda
    socket.on("error", (error) => {
      console.error("Hata:", error);
    });

    // Component unmount olduğunda bağlantıyı kapat
    return () => {
      socket.disconnect();
    };
  }, []);
  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  console.log(roomId);
  const customerRoomId = new BroadcastChannel("customerRoomId");
  customerRoomId.postMessage(roomId);
  useEffect(() => {
    if (socket) {
      socket.on("formData", (data) => {
        console.log("formdata", data);
        setCustomerName(data.name);
        setRoomId(data.roomId);
        console.log("******", roomId);
        console.log("form data müşteri ıd", data.customerId);
      });
    }
  }, [roomId, setRoomId, socket]);
  useEffect(() => {
    if (socket) {
      socket.on("logIn", (response) => {
        login(response.data.id);
      });
    }
  }, [supporterId, login]);
  const handleSendMessage = () => {
    if (message.trim() !== "" && roomId !== null) {
      const sender = "customer";
      console.log("fonksiyon içi room id", roomId);

      socket.emit("Livemessage", {
        id: 1, //??
        supporterId: supporterId,
        date: Date.now(),
        message,
        sender,
        userName: customerName,
        roomId: roomId,
      });

      addLiveChatList({
        id: 1,
        supporterId: supporterId,
        date: Date.now(),
        content: message,
        sender,
        userName: customerName,
        roomId,
      });

      setMessage("");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("supportLiveChat", (data) => {
        console.log("destekten gelen 111", data);
        addLiveChatList({
          id: data.id,
          sender: data.sender,
          content: data.message,
          time: new Date(data.date),
          userName: data.userName,
        });

        socket.on("logIn", (response) => {
          login(response.id);
        });
      });
    }
  }, [socket, addLiveChatList, liveChatList, login]);

  //console.log("müşteri adı", _customerInfo.name);

  if (!selected) {
    initialMessage = `Merhaba ${customerName}, Canlı Destek Ekibimiz En Kısa Sürede Bağlanacak`;
  } else {
    initialMessage = `Merhaba ${customerName}, Canlı Destek Ekibimiz Bağlandı Size Nasıl YArdımcı Olabiliriz`;
  }

  const sortedMessages = liveChatList.sort((a, b) => a.time - b.time);
  console.log("gelen mesajlar live chat", sortedMessages);

  //müşteri mesaj girişi ilk önce form doldurmalı, form dolu olduğunda canlı desteğe bağlanmak isterse
  // destek personeli seçim yaptığında yazabilmeli.???

  useEffect(() => {
    const customerSelected = new BroadcastChannel("customerSelected");
    customerSelected.onmessage = (msg) => setSelected(msg);
    console.log("broadCast", selected);
    if (liveChat && selected) {
      console.log("if çalıtı");
      setTextareaReadOnly(false);
    } else {
      setTextareaReadOnly(true);
    }
  }, [selected, liveChat]); //deneme yap!!

  return (
    <div>
      {" "}
      <div id="karsilamaMesaji" className="flex justify-start p-6">
        <div className="flex flex-col gap-3">
          <span className="text-gray-500 text-sm">
            Yapay Zeka Müşteri Temsilcisi
          </span>

          <span className="p-2 text-black border-gray-200 bg-gray-200 rounded-xl rounded-tl-sm dark:bg-gray-700 dark:text-white">
            {initialMessage}
          </span>
        </div>
      </div>
      {sortedMessages.map((message, index) => (
        <div key={index}>
          {message.sender === "customer" ? (
            <div id="customerLiveChatMessages" className="p-6 flex justify-end">
              <span
                className="p-2 text-white border-gray-200 rounded-xl rounded-tr-sm bg-blue-200 dark:bg-blue-700"
                key={index}
              >
                {message.message}
              </span>
            </div>
          ) : (
            <div
              id="supportLiveChatMessages"
              className="flex justify-start p-6"
            >
              <div className="flex flex-col gap-3">
                <span className="text-gray-500 text-sm">
                  Müşteri Temsilcisi
                </span>
                <span className="p-2 text-black border-gray-200 bg-gray-200 rounded-xl rounded-tl-sm dark:bg-gray-700 dark:text-white">
                  {message.message}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="textbox static flex bottom-0 right-0 left-0 p-2">
        <textarea
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleEnterKeyPress}
          readOnly={textAreaReadOnly}
          value={message}
          className="w-full h-16 p-2 border border-gray-300 rounded-md"
          placeholder="Mesajınızı buraya yazın... livechat"
        ></textarea>
        <FontAwesomeIcon
          className="absolute right-2 p-4 size-6"
          onClick={handleSendMessage}
          icon={faPaperPlane}
          style={{ cursor: "pointer", marginLeft: "5px" }}
        />
      </div>
    </div>
  );
};

export default LiveChat;
