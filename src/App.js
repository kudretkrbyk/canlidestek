import ChatComponent from "./Deneme";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import logo from "./images/642bf9a0bcb92.jpg";
import FirstCustomerMessage from "./FirstCustomerMessage";
import InputForm from "./InputForm";
import SupportPanelHead from "./SupportPanelHead";
import io from "socket.io-client";
import { socket } from "./socket";

const LiveSupport = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [alertButtonGroupHover, setAlertButtonGroupHover] = useState(false);
  const [supportOn, setSupportOn] = useState(false);
  const [alerButtonHide, setAlerButtonHide] = useState(false);
  const [textareaReadonly, setTextareaReadonly] = useState(true);
  const [customerMessages, setCustomerMessages] = useState([]);
  //const [supportAgentMessages, setSupportAgentMessages] = useState([]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Sunucu adresini ayarlayın (sunucu adresinize göre değiştirin)
    const socket = io("http://localhost:3000/");

    // Server'dan alınan mesajları dinle
    socket.on("message", (data) => {
      console.log("Serverdan mesaj alındı:", data);
    });

    // Server'dan alınan özel mesajları dinle
    socket.on("serverMessage", (data) => {
      console.log("Serverdan özel mesaj alındı:", data);
    });

    // Bağlantı kurulduğunda
    socket.on("connect", () => {
      console.log("Bağlantı kuruldu");
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

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("message", message);
      setMessage("");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenForm = (element) => {
    setFormVisible(true);
    const buttons = document.getElementById("buttons")?.children;
    for (let button of buttons)
      if (button.id !== element?.target?.id) button.classList.add("hidden");
  };

  const handleSupportOn = () => {
    setSupportOn(true);
    setAlerButtonHide(true);
  };

  const handleSupportOf = () => {
    setSupportOn(false);
    setAlerButtonHide(false);
  };

  const handleReadonly = () => {
    setTextareaReadonly(false);
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // const handleSendMessage = () => {
  //   if (message.trim() !== "") {
  //     socket.emit("message", message);
  //     setCustomerMessages((prevMessages) => [
  //       ...prevMessages,
  //       { text: message, time: new Date() },
  //     ]);
  //     setMessage("");
  //   }
  // };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = () => {
    console.log("Button clicked");
    socket.emit("send_message", { message: "Hello from client" });
  };

  const [isConnected, setIsConnected] = useState(false);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
    };
  }, []);
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <div className="  ">
      <div className="supportDiv  flex  right-0">
        <div
          className={`${
            supportOn ? "block" : "hidden"
          }   support flex flex-col relative h-screen w-screen right-0 `}
        >
          <SupportPanelHead setSupportOn1={handleSupportOf}></SupportPanelHead>

          <div id="temsilci-mesajı-1" className="p-6 w-full flex justify-start">
            <div className="flex items-start gap-3">
              <img className="w-8 h-8 rounded-full" src={logo} alt="logo" />
              <div className="flex flex-col w-full max-w-[320px] p-4 border-gray-200 bg-gray-200 rounded-xl rounded-tl-sm dark:bg-gray-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-semibold text-gray-900">
                    ARİS888
                  </span>
                  <span className="text-sm font-normal text-gray-500">
                    {currentTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm font-normal py-2.5 text-gray-900">
                  Merhaba Size nasıl yardımcı olabilirim?
                </p>
              </div>
            </div>
          </div>

          <FirstCustomerMessage
            _handleOpenForm={handleOpenForm}
          ></FirstCustomerMessage>

          <div
            id="temsilci-mesajı-2"
            className={`p-6 w-full flex justify-start  ${
              formVisible ? "" : "hidden"
            }`}
          >
            <div className="flex items-start gap-3">
              <img className="w-8 h-8 rounded-full" src={logo} alt="logo" />
            </div>{" "}
            <InputForm _handleReadonly={handleReadonly}></InputForm>
          </div>
          {customerMessages.length > 0 && (
            <div>
              {customerMessages.map((_customerMessage, index) => (
                <div key={index}>
                  <div
                    id="customerLiveChatMessages"
                    className="p-6 flex justify-end "
                  >
                    <span
                      className="p-2 border-gray-200 bg-gray-200 rounded-xl rounded-tr-sm dark:bg-gray-700"
                      key={index}
                    >
                      {_customerMessage.text}
                    </span>
                  </div>
                  <div
                    id="supportLiveChatMessages"
                    className="flex justify-start p-6"
                  >
                    <span className="p-2 border-gray-200 bg-gray-200 rounded-xl rounded-tl-sm dark:bg-gray-700">
                      sunucusupportmesssage
                    </span>
                  </div>
                </div>
              ))}
              <div className="p-6 flex justify-center">
                <button className=" p-2 border-gray-200 bg-gray-200 rounded-xl  dark:bg-gray-700">
                  Canlı Temsilciyle görüşmek için tıklayınız
                </button>
              </div>
            </div>
          )}

          <div className="textbox static flex bottom-0 right-0 left-0 p-2 ">
            <textarea
              onChange={handleInputChange}
              onKeyPress={handleEnterKeyPress}
              value={message}
              readOnly={textareaReadonly}
              className="w-full h-16 p-2 border border-gray-300 rounded-md"
              placeholder="Mesajınızı buraya yazın..."
            ></textarea>{" "}
            <FontAwesomeIcon
              className="absolute right-2 p-4 size-6"
              onClick={handleSendMessage}
              icon={faPaperPlane}
              style={{ cursor: "pointer", marginLeft: "5px" }}
            />
          </div>
        </div>
      </div>

      <div
        className={`${
          alerButtonHide ? "hidden" : "block"
        }  fixed flex flex-col justify-center  gap-6
        bottom-10 right-10
       text-2xl  font-CircularSpExtraBold
       p-5
       
       `}
        onMouseEnter={() => setAlertButtonGroupHover(true)}
        onMouseLeave={() => setAlertButtonGroupHover(false)}
      >
        <div
          className={`flex flex-col p-2 gap-2 ${
            alertButtonGroupHover ? "block" : "hidden"
          }`}
        >
          <button className="p-4 bg-slate-500 rounded-xl">WhatsApp</button>
          <button
            className="p-4 bg-slate-500 rounded-xl"
            onClick={() => handleSupportOn()}
          >
            Temsilci Görüşmesi
          </button>
        </div>
        <div>
          <span
            className={`p-7 bg-neutral-700 rounded-xl
          font-CircularSpExtraBold  `}
          >
            Müşteri Temsilcilerimiz Online
          </span>
        </div>
        <div className="App">
          <ChatComponent></ChatComponent>
          <button onClick={isConnected}>send mesaj</button>
          <button onClick={connect}>Connect</button>
        </div>
      </div>
    </div>
  );
};

export default LiveSupport;
