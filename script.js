const form = document.getElementById("feedbackForm");
const feedbackList = document.getElementById("feedbackList");

// Google Sheets details
const SPREADSHEET_ID = "11uweIrgbUpQAWicJtu0kFSs3IvZbvYFB8D-8iXhVJ7U"; // Sheet Id
const SHEET_NAME = "Sheet1";
const API_KEY = "AIzaSyC7K0nqyxfUPxCmYBnJirxdZVSEoNySa1s"; //Api Key

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const feedback = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    // Send to JSONPlaceholder API
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(feedback)
        });

        const result = await response.json();
        displayFeedback(result); // Display result from JSONPlaceholder
    } catch (err) {
        console.error("Error sending to JSONPlaceholder:", err);
    }

    // Append to Google Sheets via API
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:D:append?valueInputOption=RAW&key=${API_KEY}`;

        const body = {
            values: [
                [new Date().toLocaleString(), feedback.name, feedback.email, feedback.message]
            ]
        };

        const sheetResponse = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const sheetResult = await sheetResponse.json();
        console.log("Saved to Google Sheets:", sheetResult);
    } catch (err) {
        console.error("Error saving to Google Sheets:", err);
    }

    form.reset();
});

function displayFeedback(data) {
    const div = document.createElement("div");
    div.innerHTML = `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong> ${data.message}</p>
        <hr>
    `;
    feedbackList.prepend(div);
}



