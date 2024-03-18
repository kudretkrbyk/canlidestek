import React from "react";
import customerMessageStore from "./Store";
import { useState } from "react";
import { useEffect } from "react";

export default function CustomerIdList({ _customerWaitingList }) {
  useEffect(() => {
    console.log("customerWaitingList güncellendi:", _customerWaitingList);

    // customerWaitingList değiştiğinde burada ek işlemler yapabilirsiniz, eğer gerekirse
  }, [_customerWaitingList]);
  const {
    customerMatchId,
    addCustomerMatch,
    customerInfo,

    setCustomerWaitingList,
    selectedCustomer,
    setSelectedCustomer,
    liveCustomerMessages,
  } = customerMessageStore();

  const [supportId] = useState(1);

  useEffect(() => {
    console.log("customerWaitingList güncellendi:", _customerWaitingList);

    // customerWaitingList değiştiğinde burada ek işlemler yapabilirsiniz, eğer gerekirse
  }, [_customerWaitingList]);

  const handleCustomerClick = (customerId) => {
    // Seçilen müşteriyi bul
    const selected = _customerWaitingList.find(
      (customer) => customer.id === customerId
    );
    if (selected) {
      // Seçilen müşterinin roomId ve customerId bilgilerini sakla
      selectedCustomer([]);
      setSelectedCustomer({
        roomId: selected.roomId,
        customerId: customerId,
        userName: selected.userName,
      });

      // Seçilen müşteriyi waitingCustomerList'ten sil
      const updatedList = _customerWaitingList.filter(
        (customer) => customer.id !== customerId
      );
      setCustomerWaitingList(updatedList);

      // Tıklanan customer'ın ID'sini kullanarak customerMatchId listesine ekle
      addCustomerMatch({
        customerId,
        supportId: supportId,
        roomId: 1,
      });
    }
  };

  console.log("customerwaitinglis1111t", _customerWaitingList);

  return (
    <div>
      <h2>Customer ID ve UserName'leri:</h2>
      <ul>
        {_customerWaitingList.map((customer) => (
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
