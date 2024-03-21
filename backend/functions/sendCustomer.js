async function sendCustomer(data) {
  try {
    // Form verilerini al
    const { name, email, phoneNumber, status } = data;

    // Verileri API'ye göndermek için bir HTTP isteği yapın
    const response = await fetch(
      "https://aris888.io/api/help/customer/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone: phoneNumber,
          status,
        }),
      }
    );

    // API'den gelen yanıtı alın
    const responseData = await response.json();
    console.log("send customer APİ", responseData);
    return responseData;
  } catch (error) {
    console.error("Error while sending data to API:", error);
    throw error;
  }
}

module.exports = sendCustomer;
