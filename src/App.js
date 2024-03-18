import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LiveSupport from "./LiveSupport";
import SupportLiveChat from "./SupportLiveChat";
import CustomerIdList from "./customerIdList";
import customerMessageStore from "./Store";

export default function App() {
  const { customerWaitingList } = customerMessageStore();
  console.log("burasi app", customerWaitingList);

  return (
    <Router>
      <Routes>
        <Route
          path="/destek"
          element={
            <SupportLiveChat _customerWaitingList={customerWaitingList} />
          }
        />
        <Route
          path="/deneme"
          element={
            <CustomerIdList _customerWaitingList={customerWaitingList} />
          }
        />
        <Route path="/*" element={<LiveSupport />} />
      </Routes>
    </Router>
  );
}
