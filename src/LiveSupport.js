import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import logo from "./images/642bf9a0bcb92.jpg";
import FirstCustomerMessage from "./FirstCustomerMessage";
import InputForm from "./InputForm";
import LiveChat from "./LiveChat";

//import Customer from "./customerComp";
import customerMessageStore from "./Store";

import SupportPanelHead from "./SupportPanelHead";
import { io } from "socket.io-client";

const URL = "http://localhost:3005";

const LiveSupport = () => {
  const [socket, setSocket] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [alertButtonGroupHover, setAlertButtonGroupHover] = useState(false);
  const [supportOn, setSupportOn] = useState(false);
  const [alerButtonHide, setAlerButtonHide] = useState(false);
  const [textareaReadonly, setTextareaReadonly] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [supportAgentMessages, setSupportAgentMessages] = useState([]);

  const [message, setMessage] = useState("");
  const [liveChat, setLiveChat] = useState(false);

  // zustand liste
  //const [customerMessages, setCustomerMessages] = useState([]);
  const { customerMessages, addCustomerMessage, customerWaitingList } =
    customerMessageStore();
  console.log("burasi livesupport bileşeni", customerWaitingList);
  // İnput form ile aldığımız müşteri bilgileri
  const [customerInfo, setCustomerInfo] = useState(null);
  const handleUpdateCustomerInfo = (info) => {
    setCustomerInfo(info);
  };
  useEffect(() => {
    const socket = io.connect(URL, { transports: ["websocket"] });
    setSocket(socket);

    socket.on("message", (data) => {
      setSupportAgentMessages((prevMessages) => [
        ...prevMessages,
        { text: data.message, time: new Date() },
      ]);
    });

    // Bağlantı kurulduğunda
    socket.on("connect", () => {
      console.log("Bağlantı kuruldu", socket);
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

  // datetime fonk
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
  const handleSendMessage = () => {
    console.log("mesaj eklendi" + message + customerMessages);
    if (message.trim() !== "") {
      socket.emit("message", { id: socket.id, date: Date.now(), message });
      addCustomerMessage({ text: message, time: new Date() });
      console.log("mesaj eklendi" + message + customerMessages);

      setMessage("");
    }
  };
  // const handleInputChange = (event) => {
  //   setMessage(event.target.value);
  // };

  const test = () => {
    setLiveChat(true);

    socket.emit("request", {
      id: socket.id, //customerId'si oluşuyor.
      date: Date.now(),
      message: "temsilci",
    });
    console.log(liveChat);
  };

  return (
    <div className="  ">
      <div className="supportDiv  flex  right-0 ">
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
                  <span className="text-sm font-semibold text-black dark:text-white">
                    ARİS888
                  </span>
                  <span className="text-sm font-normal text-black dark:text-white">
                    {currentTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm font-normal py-2.5 text-black dark:text-white ">
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
            <InputForm
              updateCustomerInfo={handleUpdateCustomerInfo}
              _handleReadonly={handleReadonly}
            ></InputForm>
          </div>
          {customerMessages.length > 0 && (
            <div>
              {console.log("if e girdi kontrol")}
              {customerMessages.map((_customerMessage, index) => (
                <div key={index}>
                  <div
                    id="customerLiveChatMessages"
                    className="p-6 flex justify-end "
                  >
                    <span
                      className="p-2 text-white border-gray-200  rounded-xl rounded-tr-sm bg-blue-200  dark:bg-blue-700"
                      key={index}
                    >
                      {_customerMessage.text}
                    </span>
                  </div>
                  <div
                    id="supportLiveChatMessages"
                    className="flex justify-start p-6"
                  >
                    <div className="flex flex-col  gap-3">
                      <span className=" text-gray-500 text-sm">
                        Yapay Zeka Müşteri Temsilcisi
                      </span>
                      {supportAgentMessages[index] && (
                        <span className="p-2 text-black border-gray-200 bg-gray-200 rounded-xl rounded-tl-sm dark:bg-gray-700 dark:text-white">
                          {supportAgentMessages[index].text}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-6 flex justify-center">
                <button
                  onClick={test}
                  className=" p-2 border-gray-200 bg-gray-200 rounded-xl  dark:bg-gray-700"
                >
                  Canlı Temsilciyle görüşmek için tıklayınız
                </button>
              </div>
            </div>
          )}

          {/* canlı iletişime geçiyoruz*/}

          {liveChat && (
            <div>
              {" "}
              {console.log(liveChat)}
              {/* İçerik buraya gelecek */}
              <LiveChat
                _customerInfo={customerInfo}
                _handleSendMessage={handleSendMessage}
                socket={socket}
              ></LiveChat>
            </div>
          )}

          {!liveChat && (
            <div className="textbox static flex bottom-0 right-0 left-0 p-2">
              <textarea
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleEnterKeyPress}
                value={message}
                readOnly={textareaReadonly}
                className="w-full h-16 p-2 border border-gray-300 rounded-md"
                placeholder="Mesajınızı buraya yazın..."
              ></textarea>
              <FontAwesomeIcon
                className="absolute right-2 p-4 size-6"
                onClick={handleSendMessage}
                icon={faPaperPlane}
                style={{ cursor: "pointer", marginLeft: "5px" }}
              />
            </div>
          )}
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
          className={` flex flex-col p-2 gap-2 transition-opacity ease-in-out duration-500 ${
            alertButtonGroupHover
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
          }`}
        >
          <button className="p-4 bg-cyan-400 rounded-xl">WhatsApp</button>
          <button
            className="p-4 bg-cyan-400 rounded-xl"
            onClick={() => handleSupportOn()}
          >
            Temsilci Görüşmesi
          </button>
        </div>
        <div>
          <span
            className="p-7 bg-gradient-to-r from-cyan-500 to-blue-500 bg-neutral-700 rounded-xl
          font-CircularSpExtraBold"
          >
            Müşteri Temsilcilerimiz Online
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveSupport;
