import { BASE_URL } from "./config.js";

async function login() {
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#pass').value.trim();

    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }

    // Disable button to prevent multiple clicks
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.textContent = "Logging in...";
    }

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            let errorMessage = "Login failed";

            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }

            alert(errorMessage);
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.textContent = "Login";
            }
            return;
        }

        const data = await response.json();
        console.log("Login response:", data); 

        if (!data.token || !data.role) {
            alert("Invalid server response");
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.textContent = "Login";
            }
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("Id", data.userId);
        
        console.log("Stored role:", data.role);
        console.log("Stored username:", data.username);

        const userRole = data.role.toUpperCase();
        let redirectPath = "";
        
        if (userRole === "ADMIN" || userRole === "ROLE_ADMIN") {
            redirectPath = "/pages/dashboard.html";
            console.log("Admin user - redirecting to dashboard");
        } else if (userRole === "CASHIER" || userRole === "ROLE_CASHIER") {
            redirectPath = "/pages/cash.html";
            console.log("Cashier user - redirecting to cash page");
        } else {
            alert("Unknown role: " + data.role);
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.textContent = "Login";
            }
            return;
        }
        alert("Login successful! Redirecting...");
        
        setTimeout(() => {
            window.location.href = redirectPath;
        }, 100);

    } catch (error) {
        console.error("Login error:", error);

        if (error.name === "TypeError") {
            alert("Network error or CORS issue. Check backend or URL.");
        } else {
            alert("Something went wrong. Please try again.");
        }
        
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = "Login";
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
        console.log("Login button event attached");
    } else {
        console.error("Login button not found!");
    }

    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#pass');
    
    if (usernameInput && passwordInput) {
        const handleEnter = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                login();
            }
        };
        usernameInput.addEventListener('keypress', handleEnter);
        passwordInput.addEventListener('keypress', handleEnter);
    }
});