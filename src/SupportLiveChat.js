import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import customerMessageStore from "./Store";
import CustomerIdList from "./customerIdList";

const URL = "http://localhost:3005";

export default function SupportLiveChat({ _customerWaitingList }) {
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const {
    addSupportAgentMessages,
    liveChatList,
    addLiveChatList,
    selectedCustomer,
    supportId,
    customerWaitingList,
  } = customerMessageStore();

  useEffect(() => {
    const socket = io.connect(URL, { transports: ["websocket"] });
    setSocket(socket);

    socket.on("message", (data) => {
      addSupportAgentMessages((prevMessages) => [
        ...prevMessages,
        { text: data.message, time: new Date() },
      ]);
    });

    socket.on("connect", () => {
      console.log("Bağlantı kuruldu", socket);
    });

    socket.on("disconnect", () => {
      console.log("Bağlantı kapatıldı");
    });

    socket.on("error", (error) => {
      console.error("Hata:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [addSupportAgentMessages]);

  useEffect(() => {
    if (socket) {
      socket.on("Livemessage", (data) => {
        console.log("mesaj geld111i", data.userName);
        console.log("mesaj geld111i", data);
        addLiveChatList({
          id: data.id,
          sender: data.sender,
          content: data.message,
          time: new Date(data.date),
          userName: data.userName,
        });
      });
    }
  }, [socket, addLiveChatList]);

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (message.trim() !== "" && socket) {
      const sender = "support";
      //const userName = "support";
      //const id = socket.id;
      socket.emit("supportLiveChat", {
        supportId,
        date: Date.now(),
        message,
        sender,
        userName: "?",
        roomId: selectedCustomer.roomId,
      });
      addLiveChatList({
        supportId,
        sender,
        content: message,
        time: new Date(),
        userName: "?",
        roomId: selectedCustomer.roomId,
      });

      setMessage("");
    }
  };
  useEffect(() => {
    console.log("customerWaitingList güncellendi:", customerWaitingList);
    console.log("___customerWaitingList güncellendi:", _customerWaitingList);
    // customerWaitingList değiştiğinde burada ek işlemler yapabilirsiniz, eğer gerekirse
  }, [customerWaitingList]);

  console.log("liste içeriği livechatlist111", liveChatList);

  const sortedMessages = liveChatList.sort((a, b) => a.time - b.time);
  return (
    <div>
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
}
