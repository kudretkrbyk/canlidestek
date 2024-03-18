import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import customerMessageStore from "./Store";

const LiveChat = ({ _customerInfo, socket }) => {
  const {
    liveChatList,
    addLiveChatList,
    customerInfo,
    selectedCustomer,
    supportId,
  } = customerMessageStore();
  const [message, setMessage] = useState("");

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const sender = "customer";

      socket.emit("Livemessage", {
        id: selectedCustomer.customerId,
        supportId,
        date: Date.now(),
        message,
        sender,
        userName: selectedCustomer.userName,
        roomId: selectedCustomer.roomId,
      });

      addLiveChatList({
        id: selectedCustomer.customerId,
        supportId,
        sender,
        content: message,
        time: new Date(),
        userName: selectedCustomer.userName,
        roomId: selectedCustomer.roomId,
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
      });
    }
  }, [socket, addLiveChatList]);
  // console.log(" mesaj listesi=", liveChatList[1].message);
  console.log("livechatlist json", JSON.stringify(liveChatList, null, 2));
  //console.log("müşteri adı", _customerInfo.name);
  const initialMessage = `Merhaba ${customerInfo.userName}, size nasıl yardımcı olabilirim?`;
  const sortedMessages = liveChatList.sort((a, b) => a.time - b.time);
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
