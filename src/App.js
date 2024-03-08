import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LiveSupport from "./LiveSupport";
import SupportLiveChat from "./SupportLiveChat";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/destek" element={<SupportLiveChat />} />
        <Route path="/*" element={<LiveSupport />} />
      </Routes>
    </Router>
  );
}
