from flask import Flask, request, jsonify, render_template_string
from google import genai
import os

app = Flask(__name__)

# =========================================================
# STUDENT INSTRUCTIONS
# =========================================================
# 1. Install the Gemini SDK first:
#    pip install google-genai flask
#
# 2. Create your API key from Google AI Studio.
#
# 3. Do NOT hardcode your key directly in code for real projects.
#    Instead, set an environment variable named GEMINI_API_KEY.
#
#    On Windows PowerShell:
#    setx GEMINI_API_KEY "PASTE_YOUR_KEY_HERE"
#
#    Then restart your terminal before running the program.
#
# 4. This line reads the API key from your environment:
#    os.getenv("GEMINI_API_KEY")
#
# 5. If your key is missing, the app will still run, but the
#    /chat route will return an instructional message.
# =========================================================

api_key = os.getenv("GEMINI_API_KEY", "")

client = None
if api_key:
    client = genai.Client(api_key=api_key)

HTML_PAGE = """
<!DOCTYPE html>
<html>
<head>
    <title>Async + Flask Lab</title>
</head>
<body>

<h2>Async + Flask Chat</h2>

<div id="chat"></div>

<form id="form">
    <input id="input" placeholder="Type message..." />
    <button>Send</button>
</form>

<script>
const form = document.getElementById("form");
const input = document.getElementById("input");
const chat = document.getElementById("chat");

function addMessage(text) {
    const div = document.createElement("div");
    div.textContent = text;
    chat.appendChild(div);
}

// ================================
// STUDENT TASK (FRONTEND)
// ================================
// Fill in the missing parts below:
// - fetch()
// - await
// - response.json()
// ================================

async function sendMessage(message) {
    try {

        // STEP 1: Make request to Flask
        const response = /* TODO:
            use fetch("http://127.0.0.1:5000/chat", {...})
            include:
            - method: POST
            - headers: Content-Type application/json
            - body: JSON.stringify({ message: message })
        */

        // STEP 2: Check if request worked
        if (!response.ok) {
            console.log("Error:", response.status);
            return "Error occurred";
        }

        // STEP 3: Convert to JSON
        const data = /* TODO:
            use await response.json()
        */

        return data.reply;

    } catch (error) {
        console.error("Error:", error);
        return "Something went wrong";
    }
}

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const message = input.value;
    input.value = "";

    addMessage("You: " + message);

    const reply = await sendMessage(message);

    addMessage("Bot: " + reply);
});
</script>

</body>
</html>
"""

@app.route("/")
def home():
    return render_template_string(HTML_PAGE)

@app.route("/chat", methods=["POST"])
def chat():
    try:
        # If the student has not added their API key yet,
        # return a helpful message instead of crashing.
        if client is None:
            return jsonify({
                "reply": (
                    "No API key found. Set your GEMINI_API_KEY environment "
                    "variable first, then restart the Flask app."
                )
            }), 500

        data = request.get_json()
        message = data.get("message", "").strip()

        if not message:
            return jsonify({"reply": "Please type a message first."}), 400

        # STUDENT NOTE:
        # You can change the prompt below to control the chatbot behavior.
        # Example:
        # contents = f"You are a helpful tutor. User said: {message}"
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=f"You are a helpful chatbot. Reply clearly and briefly. User: {message}"
        )

        reply_text = response.text if response.text else "I could not generate a response."

        return jsonify({"reply": reply_text})

    except Exception as error:
        return jsonify({"reply": f"Server error: {str(error)}"}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)