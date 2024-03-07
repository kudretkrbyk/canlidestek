import React, { useState } from "react";
import InputForm from "./InputForm";

const Customer = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const updateCustomerInfo = (newInfo) => {
    setCustomerInfo(newInfo);
  };

  return (
    <div>
      <h2>Müşteri: {customerInfo.name}</h2>
      <InputForm updateCustomerInfo={updateCustomerInfo} />
    </div>
  );
};

export default Customer;
