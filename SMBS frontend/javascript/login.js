import { BASE_URL } from "./config.js";

async function login() {
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#pass').value;

  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("username", data.username);
  localStorage.setItem("Id", data.userId);

  if(data.role === "ROLE_ADMIN"){
    window.location.href = "/pages/dashboard.html";
  }else if(data.role === "ROLE_CASHIER"){
    window.location.href = ("/pages/cash.html")
  }else{
    window.alert("Unknown Role");
  }

  alert("Login success");
}

document.getElementById('login-btn').addEventListener('click', login);