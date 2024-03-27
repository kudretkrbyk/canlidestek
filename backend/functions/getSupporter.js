async function getSupporter() {
  try {
    const response = await fetch("https://aris888.io/api/help/customer/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "202105212",
      }),
    });

    if (!response.ok) {
      throw new Error("supporter get " + response.status);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error while sending update request:", error);
    throw error;
  }
}

module.exports = getSupporter;
