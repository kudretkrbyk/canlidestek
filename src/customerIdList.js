import React from "react";

import authStore from "./supporterIdStore";
import { useState } from "react";
import { useEffect } from "react";
//import customerMessageStore from "./Store";
import { io } from "socket.io-client";
const URL = "http://localhost:3005";

export default function CustomerIdList({ setSupportTextAreaInput }) {
  const [socket, setSocket] = useState(null);

  const [customerWaitingList, setCustomerWaitingList] = useState([]);
  const [selectedCustomerFrontend, setSelectedCustomerFrontend] = useState();
  const [setSelected] = useState(false);

  const { supporterId } = authStore();

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
      socket.on("log", (data) => {
        console.log("************supporter id", data);
      });
    }
  }, [socket]);
  // console.log("store supporterI", supporterId);

  useEffect(() => {
    if (socket) {
      socket.on("allCustomers", (data) => {
        console.log("Mesaj geldi all customers", data);
        setCustomerWaitingList(data);
      });
    }
  }, [socket]);

  const handleCustomerClick = (customerId) => {
    //setSelected(true);

    const selected = customerWaitingList.find(
      (customer) => customer.id === customerId
    );

    if (selected) {
      setSupportTextAreaInput(false);
      console.log("if selected");
      const selectedUpdated = {
        id: selected.id,
        supporterId,
        status: false,
        name: selected.name,
        email: selected.email,
        phone: selected.phone,
        roomId: selected.roomId,
        selected,
      };

      setSelectedCustomerFrontend(selectedUpdated);
    }
  };
  useEffect(() => {
    if (selectedCustomerFrontend) {
      socket.emit("selectedCustomer", selectedCustomerFrontend);
    }
  }, [socket, selectedCustomerFrontend]);

  //console.log("customerwaitinglist", customerWaitingList);
  //console.log("selectedCustomerFrontend", selectedCustomerFrontend);

  return (
    <div>
      <h2>Customer ID ve UserName'leri:</h2>
      <ul>
        {customerWaitingList
          .filter((customer) => customer.status === true)
          .map((customer) => (
            <li
              key={customer.id}
              onClick={() => handleCustomerClick(customer.id)}
              style={{ cursor: "pointer" }}
            >
              {`ID: ${customer.id}, UserName: ${customer.name}`}
            </li>
          ))}
      </ul>
    </div>
  );
}
