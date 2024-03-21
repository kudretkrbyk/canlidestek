const fetch = require("node-fetch");

async function getAllCustomers() {
  try {
    const response = await fetch("https://aris888.io/api/help/customer/getAll");
    if (!response.ok) {
      throw new Error("Error while fetching customers");
    }
    const data = await response.json(); // API'den gelen veriyi JSON formatına dönüştür
    return data;
    //console.log(" get all cevabi:", data);
  } catch (error) {
    console.error("Error while fetching customers:", error);
    throw error;
  }
}

module.exports = getAllCustomers;
