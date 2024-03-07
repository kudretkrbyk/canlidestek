import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import customerMessageStore from "./Store";

const LiveChat = ({ _customerInfo, socket }) => {
  const { liveCustomerMessages, addLiveCustomerMessage } =
    customerMessageStore();

  const [message, setMessage] = useState("");
  const [supportAgentMessages, setSupportAgentMessages] = useState([]);

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      console.log("handle trim geldi");
      socket.emit("Livemessage", {
        id: socket.id,
        date: Date.now(),
        message,
      });
      console.log("emit");
      addLiveCustomerMessage({ text: message, time: new Date() });
      setMessage("");
    }
  };
  socket.on("Livemessage", (data) => {
    console.log("mesaj geldi", data.message);
    setSupportAgentMessages((prevMessages) => [
      ...prevMessages,
      { text: data.message, time: new Date() },
    ]);
  });

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const initialMessage = `Merhaba ${_customerInfo.name}, size nasıl yardımcı olabilirim?`;

  return (
    <div>
      <div>
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
        {liveCustomerMessages.map((_customerMessage, index) => (
          <div key={index}>
            <div
              id="customerLiveChatMessages"
              className="p-6 flex justify-end "
            >
              <span
                className="p-2 text-white border-gray-200 rounded-xl rounded-tr-sm bg-blue-200 dark:bg-blue-700"
                key={index}
              >
                {_customerMessage.text} {supportAgentMessages.text}
              </span>
            </div>
            <div
              id="supportLiveChatMessages"
              className="flex justify-start p-6"
            >
              <div className="flex flex-col gap-3">
                <span className="text-gray-500 text-sm">
                  Yapay Zeka Müşteri Temsilcisi
                </span>
                <span className="p-2 text-black border-gray-200 bg-gray-200 rounded-xl rounded-tl-sm dark:bg-gray-700 dark:text-white">
                  {supportAgentMessages.length > 0 &&
                    supportAgentMessages[0].text}{" "}
                  temsilci mesajı
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="textbox static flex bottom-0 right-0 left-0 p-2">
        <textarea
          onChange={handleInputChange}
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
