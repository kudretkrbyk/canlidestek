import React, { useState, useEffect, Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import customerMessageStore from "./Store";
import { io } from "socket.io-client";

const URL = "http://localhost:3005";

const LiveChat = () => {
  const { liveChatList, addLiveChatList } = customerMessageStore();
  const [message, setMessage] = useState("");
  const { roomId, setRoomId } = customerMessageStore();

  const [supporterId, setSupporterId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [setSelectedCustomerUpdated] = useState(null);
  const [customerName, setCustomerName] = useState(null);

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

    socket.on("selectedSupportId", (data) => {
      setSupporterId(data);
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
  useEffect(() => {
    if (socket) {
      // socket.on("selectedCustomer", (data) => {
      //   if (data !== null) {
      //     setRoomId(data.roomId);
      //     //setSelectedCustomerUpdated(data);
      //     console.log("live chat roomid", roomId);
      //     console.log("roomıd ", roomId);
      //   }
      // });
    }
  }, [roomId, setRoomId]);
  console.log(roomId);

  useEffect(() => {
    if (socket) {
      socket.on("formData", (data) => {
        console.log("formdata", data);
        setCustomerName(data.name);
        setRoomId(data.roomId);
        console.log("******", roomId);
      });
    }
  }, [roomId, socket]);
  useEffect(() => {});
  const handleSendMessage = () => {
    if (message.trim() !== "" && roomId !== null) {
      const sender = "customer";
      console.log("fonksiyon içi room id", roomId);

      socket.emit("Livemessage", {
        id: 1, //??
        supporterId,
        date: Date.now(),
        message,
        sender,
        userName: customerName,
        roomId,
      });

      addLiveChatList({
        id: 1,
        supporterId,
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
          setSupporterId(response.id);
        });
      });
    }
  }, [socket]);

  //console.log("müşteri adı", _customerInfo.name);
  const initialMessage = `Merhaba ${customerName}, size nasıl yardımcı olabilirim?`;
  const sortedMessages = liveChatList.sort((a, b) => a.time - b.time);
  console.log("gelen mesajlar live chat", sortedMessages);
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
