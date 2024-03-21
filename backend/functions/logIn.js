const fetch = require("node-fetch");

// Login API'sine istek oluşturan fonksiyon
async function sendLoginRequest(email, password) {
  try {
    const response = await fetch(
      "https://aris888.io/api/help/supporter/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    const responseData = await response.json();
    console.log("Login API Response:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error while sending login request:", error);
    throw error;
  }
}

module.exports = { sendLoginRequest };
