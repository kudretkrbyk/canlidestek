async function sendMessages(roomId, requestData) {
  try {
    const requestBody = { roomId, ...requestData }; // roomId ve requestData objelerini birleştirme
    const response = await fetch(
      "http://localhost:3000/api/help/message/createAll",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Birleştirilmiş veriyi JSON formatına dönüştürme
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Bir hata oluştu");
    }

    const responseData = await response.json();
    console.log("İstek başarılı: mesaj ekleme ", responseData);
    return responseData;
  } catch (error) {
    console.error("İstek hatası: mesaj ekleme ", error);
    throw error;
  }
}

module.exports = sendMessages;
