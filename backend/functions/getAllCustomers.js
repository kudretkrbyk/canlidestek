async function getAllCustomers() {
  try {
    const response = await fetch("https://aris888.io/api/help/customer/getAll", { method: "POST" })
      .then((response) => response?.json()).catch((e) => null);
    if (!response || response.status !== 200) return [];
    return response?.data || [];
  } catch (error) {
    console.error("Error while fetching customers:", error);
    throw error;
  }
}

module.exports = getAllCustomers;
