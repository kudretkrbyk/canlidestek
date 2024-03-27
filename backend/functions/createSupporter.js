async function createSupporterModule() {
  const response = await fetch("https://aris888.io/api/help/supporter/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "kdrt",
      email: "kdrt@ornek.com",
      password: "111222",
    }),
  });

  try {
    const responseData = await response.json();
    console.log("create supporter", responseData);
    return responseData;
  } catch (error) {
    console.error("Error creating supporter:", error);
    throw error;
  }
}

module.exports = createSupporterModule;
