async function updateCustomer(data) {
  try {
    const { id, status, supporterId } = data;
    // Verileri API'ye göndermek için bir HTTP isteği yapın
    const response = await fetch(
      "https://aris888.io/api/help/customer/update",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
          supporterId,
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

module.exports = updateCustomer;
