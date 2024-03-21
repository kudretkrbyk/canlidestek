import React, { useState } from "react";

import { io } from "socket.io-client";
import { useEffect } from "react";
const URL = "http://localhost:3005";

export default function InputForm({ updateCustomerInfo, _handleReadonly }) {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socket = io.connect(URL, { transports: ["websocket"] });
    setSocket(socket);

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
  }, []);

  const roomId = Math.floor(Math.random() * 1000) + 1;
  const customerId = Math.floor(Math.random() * 1000) + 1;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    roomId,
    customerId,
    //status: 1,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form verilerini al
    const { name, email, phoneNumber, status } = formData;

    socket.emit("formData", {
      name: String(name),
      email: String(email),
      phoneNumber: String(phoneNumber),
      status: String(status),
    });
  };

  const isFormValid =
    formData.name !== "" &&
    formData.email !== "" &&
    formData.phoneNumber !== "";
  // Güncellenmiş customerWaitingList değerini yazdır

  return (
    <div>
      <div
        className="sticky flex flex-col w-full 
      max-w-[320px] p-4 border-gray-200 
      bg-gray-200 rounded-xl rounded-tl-sm 
      dark:bg-gray-700"
      >
        <form className="" onSubmit={handleSubmit}>
          <div className="">
            <h1 className="text-wrap text-xl p-2">
              Sizi Daha Yakından Tanımak İsteriz
            </h1>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Adınız
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Ad Soyad*"
              required
            />
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Mail Adresiniz
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Mail Adresiniz*"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="phoneNumber"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Telefon Numaranız
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Telefon Numaranız*"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className={`text-white bg-slate-700 hover:bg-slate-900 ${
              isFormValid ? "" : "opacity-50 cursor-not-allowed"
            } focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
            disabled={!isFormValid}
            onClick={_handleReadonly}
          >
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
}
