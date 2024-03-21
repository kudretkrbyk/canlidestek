import React from "react";
import customerMessageStore from "./Store";
import { useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function CustomerIdList() {
  const [socket, setSocket] = useState(null);
  const [supporterId, setSupporterId] = useState(null);

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

  useEffect(() => {
    if (socket) {
      socket.on("allCustomers", (data) => {
        console.log("Mesaj geldi", data);
        // Assuming data contains id, name, email, roomId, supporterId, and status properties
        const { id, name, email, roomId, supporterId, status } = data;
        // Update waitingCustomerList with the new customer data
        //Status değerini görmek için aldık çalışıyorsa alınmasında gerek yok.

        setCustomerWaitingList((prevList) => [
          ...prevList.filter((customer) => customer.status === 1),
          { id, name, email, roomId, supporterId, status },
        ]);
      });
      socket.on("logIn", (response) => {
        setSupporterId(response.id);
      });
      socket.on("selectedCustomer", (data) => {
        ////?????
      });
    }

    return () => {
      if (socket) {
        socket.off("allCustomers");
      }
    };
  }, []);
  // customerWaitingList değiştiğinde burada ek işlemler yapabilirsiniz, eğer gerekirse

  const {
    setCustomerWaitingList,

    customerWaitingList,
  } = customerMessageStore();
  const [selectedCustomerFrontend, setSelectedCustomerFrontend] =
    useState(null);

  const handleCustomerClick = (customerId) => {
    // Seçilen müşteriyi bul
    const selected = customerWaitingList.find(
      (customer) => customer.id === customerId
    );
    if (selected) {
      // Seçilen müşterinin roomId ve customerId bilgilerini sakla
      selectedCustomerFrontend([]);
      const randomRoomId = Math.floor(Math.random() * 10000);
      setSelectedCustomerFrontend({
        id: selected.id,
        supporterId: supporterId,
        status: 0,
        name: selected.name,
        email: selected.email,
        phone: selected.phone,
        roomId: randomRoomId,
      });
      socket.emit("selectedCustomer", {
        selectedCustomerFrontend,
      });
      setSelectedCustomerFrontend([]);
    }
  };

  console.log("customerwaitinglis1111t", customerWaitingList);

  return (
    <div>
      <h2>Customer ID ve UserName'leri:</h2>
      <ul>
        {customerWaitingList.map((customer) => (
          <li
            key={customer.customerId}
            onClick={() => handleCustomerClick(customer.customerId)}
            style={{ cursor: "pointer" }}
          >
            {`ID: ${customer.customerId}, UserName: ${customer.userName}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
