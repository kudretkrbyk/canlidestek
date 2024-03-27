import React from "react";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import LiveSupport from "./LiveSupport";
import SupportLiveChat from "./SupportLiveChat";
import CustomerIdList from "./customerIdList";
import customerMessageStore from "./Store";
import InputForm from "./InputForm";
import LoginPage from "./logIn";
import LiveChat from "./LiveChat";

export default function App() {
  return (
    <Routes>
      <Route path="/destek" element={<LoginPage />} />
      <Route path="/deneme" element={<CustomerIdList />} />
      <Route path="/*" element={<LiveSupport />} />
      <Route path="/support-live-chat" element={<SupportLiveChat />} />
      <Route path="/input" element={<InputForm />} />
      <Route path="/live" element={<LiveChat />} />
    </Routes>
  );
}
