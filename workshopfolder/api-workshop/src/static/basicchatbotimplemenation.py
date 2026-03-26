from flask import Flask, request, jsonify, render_template_string
from google import genai
import os

app = Flask(__name__)

# Use environment variable for API key (more secure than hardcoding)
api_key = os.getenv("GEMINI_API_KEY", "")
client = genai.Client(api_key=api_key)

HTML_PAGE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gemini Chatbot</title>
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f4f7fb;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .chat-container {
            width: 420px;
            max-width: 95%;
            height: 650px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.12);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .chat-header {
            background: #2563eb;
            color: white;
            padding: 18px;
            text-align: center;
        }

        .chat-header h1 {
            margin: 0;
            font-size: 22px;
        }

        .chat-header p {
            margin: 6px 0 0;
            font-size: 14px;
            opacity: 0.9;
        }

        .chat-box {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: #f9fbff;
        }

        .message {
            max-width: 80%;
            padding: 12px 14px;
            margin-bottom: 12px;
            border-radius: 14px;
            line-height: 1.4;
            word-wrap: break-word;
        }

        .user {
            background: #2563eb;
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 4px;
        }

        .bot {
            background: #e5e7eb;
            color: #111827;
            margin-right: auto;
            border-bottom-left-radius: 4px;
        }

        .chat-input-area {
            display: flex;
            padding: 14px;
            border-top: 1px solid #e5e7eb;
            background: white;
        }

        .chat-input-area input {
            flex: 1;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 10px;
            outline: none;
            font-size: 15px;
        }

        .chat-input-area button {
            margin-left: 10px;
            padding: 12px 16px;
            border: none;
            border-radius: 10px;
            background: #2563eb;
            color: white;
            cursor: pointer;
            font-size: 15px;
        }

        .chat-input-area button:hover {
            background: #1d4ed8;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h1>Gemini Chatbot</h1>
            <p>Single Python File</p>
        </div>

        <div id="chat-box" class="chat-box">
            <div class="message bot">Hi, ask me anything.</div>
        </div>

        <form id="chat-form" class="chat-input-area">
            <input
                type="text"
                id="user-input"
                placeholder="Type your message..."
                autocomplete="off"
                required
            />
            <button type="submit">Send</button>
        </form>
    </div>

    <script>
        const chatForm = document.getElementById("chat-form");
        const userInput = document.getElementById("user-input");
        const chatBox = document.getElementById("chat-box");

        function addMessage(text, sender) {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message", sender);
            messageDiv.textContent = text;
            chatBox.appendChild(messageDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        chatForm.addEventListener("submit", async function(e) {
            e.preventDefault();

            const message = userInput.value.trim();
            if (!message) return;

            addMessage(message, "user");
            userInput.value = "";

            addMessage("Thinking...", "bot");
            const thinkingBubble = chatBox.lastElementChild;

            try {
                const response = await fetch("/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ message: message })
                });

                const data = await response.json();
                thinkingBubble.remove();
                addMessage(data.reply, "bot");
            } catch (error) {
                thinkingBubble.remove();
                addMessage("Something went wrong. Please try again.", "bot");
                console.error(error);
            }
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
        data = request.get_json()
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({"reply": "Please type a message first."}), 400

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=f"You are a helpful chatbot. Reply clearly and briefly. User: {user_message}",
        )

        reply_text = response.text if response.text else "I could not generate a response."
        return jsonify({"reply": reply_text})

    except Exception as e:
        return jsonify({"reply": f"Error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
