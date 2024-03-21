const fetch = require("node-fetch");

async function sendCustomerUpdateRequest(customerId, updateData) {
  try {
    const response = await fetch(
      "https://aris888.io/api/help/customer/update",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: customerId,
          ...updateData,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Error while updating customer. Status: " + response.status
      );
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error while sending update request:", error);
    throw error;
  }
}

module.exports = sendCustomerUpdateRequest;
