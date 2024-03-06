// src/App.js (örnek olarak)

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // Backend'in bulunduğu adres ve port

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    // Server'dan alınan mesajları dinle
    socket.on("message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: data, sender: "Diğer Kullanıcı" },
      ]);
    });

    // Server'dan alınan özel mesajları dinle
    socket.on("serverMessage", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: data, sender: "Server" },
      ]);
    });

    // Component unmount olduğunda socket bağlantısını kapat
    return () => socket.disconnect();
  }, []); // Boş dependency array, sadece bir kere çalışmasını sağlar

  const handleSendMessage = (event) => {
    event.preventDefault();
    socket.emit("message", inputMessage);

    setMessages((prevMessages) => [
      ...prevMessages,
      { content: inputMessage, sender: "Ben" },
    ]);
    setInputMessage("");
  };

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{`${message.sender}: ${message.content}`}</li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Mesajınızı girin"
        />
        <button type="submit">Gönder</button>
      </form>
    </div>
  );
}

export default App;
