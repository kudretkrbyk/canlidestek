import React from "react";
import { useState } from "react";

export default function ContactForm() {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const handleSendMessage = () => {
    // Burada mesaj gönderme işlemlerini gerçekleştirebilirsiniz

    console.log("Form verileri:", formData);

    // Mesaj gönderildikten sonra state'leri sıfırlayabilirsiniz
    //setSupportOpen(false);
    //setMessage("");
    //setSelectedQuestions([]); // Soruları sıfırla
    setFormData({
      fullName: "",
      email: "",
      phone: "",
    });
  };
  return (
    <div>
      <div className="mt-4">
        <div>
          <span>Sizi tanımak isteriz</span>
        </div>
        <div>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Ad Soyad"
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="E-posta Adresi"
          />
        </div>
        <div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Telefon"
          />
        </div>
        <div
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer border-solid border-2 border-indigo-500"
          onClick={handleSendMessage}
        >
          Gönder
        </div>
      </div>
    </div>
  );
}
