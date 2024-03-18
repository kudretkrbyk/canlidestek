import React, { useState } from "react";
import customerMessageStore from "./Store";

export default function InputForm({ updateCustomerInfo, _handleReadonly }) {
  const roomId = Math.floor(Math.random() * 1000) + 1;
  const customerId = Math.floor(Math.random() * 1000) + 1;

  const {
    setCustomerInfo,
    customerInfo,
    customerWaitingList,

    setRoomIdList,
    roomIdList,
  } = customerMessageStore();
  const { setCustomerWaitingList } = customerMessageStore((state) => ({
    setCustomerWaitingList: state.setCustomerWaitingList,
  }));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    roomId,
    customerId,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Rastgele roomId ve customerId oluştur
    const newRoomId = Math.floor(Math.random() * 1000) + 1;
    const newCustomerId = Math.floor(Math.random() * 1000) + 1;

    // Yeni müşteri bilgisi
    const newCustomerInfo = {
      roomId: newRoomId,
      customerId: newCustomerId,
      userName: formData.name,
    };

    // WaitingCustomerList'e yeni bilgiyi ekleyin
    // Daha önce tanımlanan setCustomerWaitingList fonksiyonunu kullanıyoruz

    // CustomerInfo'yu temizle ve yeni müşteri bilgisini customerInfo'ya ekleyin
    setCustomerInfo(newCustomerInfo);
    // setRoomIdList(newCustomerInfo);
    setRoomIdList({
      customerId: newCustomerInfo.customerId,
      roomId: newCustomerInfo.roomId,
      userName: newCustomerInfo.userName,
    });

    console.log("room ıd List", roomIdList);
    // setCustomerWaitingList({
    //   customerId: newCustomerInfo.customerId,
    //   roomId: newCustomerInfo.roomId,
    //   userName: newCustomerInfo.userName,
    // });
    setCustomerWaitingList(newCustomerInfo);

    console.log("Güncellenmiş customerWaitingList:", customerWaitingList);
    console.log("Yeni eklenen veri:", newCustomerInfo);

    // Readonly durumunu ayarla
    _handleReadonly();

    // Form verilerini temizle
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      roomId: Math.floor(Math.random() * 1000) + 1, // Yeni bir roomId oluştur
      customerId: Math.floor(Math.random() * 1000) + 1, // Yeni bir customerId oluştur
    });
  };

  const isFormValid =
    formData.name !== "" &&
    formData.email !== "" &&
    formData.phoneNumber !== "";
  // Güncellenmiş customerWaitingList değerini yazdır
  console.log(
    "Güncellenmiş customerWaitingListsdvsdgsdv:",
    customerWaitingList
  );
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
