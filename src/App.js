import React from "react";
import { Route, Routes } from "react-router-dom";
//import { useState } from "react";
import LiveSupport from "./LiveSupport";
import SupportLiveChat from "./SupportLiveChat";
import CustomerIdList from "./customerIdList";
import customerMessageStore from "./Store";
import InputForm from "./InputForm";
import LoginPage from "./logIn";

export default function App() {
  const { customerWaitingList } = customerMessageStore();
  console.log("burasi app", customerWaitingList);

  const handleLogin = () => {};

  return (
    <Routes>
      <Route path="/destek" element={<LoginPage handleLogin={handleLogin} />} />
      <Route
        path="/deneme"
        element={<CustomerIdList _customerWaitingList={customerWaitingList} />}
      />
      <Route path="/*" element={<LiveSupport />} />
      <Route path="/support-live-chat" element={<SupportLiveChat />} />
      <Route path="/input" element={<InputForm />} />
    </Routes>
  );
}
