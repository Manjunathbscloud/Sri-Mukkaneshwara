// Define the single valid access key
const validAccessKey = "XYZ123";  // Change this to your actual key

// Handle login
document.getElementById("loginBtn").addEventListener("click", function (e) {
    e.preventDefault();

    const accessKey = document.getElementById("authKey").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    if (accessKey === validAccessKey) {
        // Store session
        sessionStorage.setItem("isAuthenticated", "true");
        window.location.href = "accounts.html";
    } else {
        errorMessage.textContent = "Invalid access key.";
    }
});

// Clear error on typing
document.getElementById("authKey").addEventListener("input", function () {
    document.getElementById("errorMessage").textContent = "";
});
