import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!message.trim() || loading) return;

        const userMessage = {
            role: "user",
            content: message
        };

        setMessages((prev) => [...prev, userMessage]);
        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/chat",
                {
                    message: message
                }
            );

            const botMessage = {
                role: "assistant",
                content: response.data.reply
            };

            setMessages((prev) => [...prev, botMessage]);

        } catch (error) {
            const errorMessage = {
                role: "assistant",
                content: "Sorry, something went wrong."
            };

            setMessages((prev) => [...prev, errorMessage]);
        }

        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="app">
            <div className="chat-container">

                <div className="chat-header">
                    <h2>AI Chatbot</h2>
                    <p>Powered by OpenRouter</p>
                </div>

                <div className="chat-messages">

                    {messages.length === 0 && (
                        <div className="welcome">
                            <h2>👋 Hello!</h2>
                            <p>Ask me anything.</p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.role}`}
                        >
                            <div className="message-content">
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="message assistant">
                            <div className="message-content">
                                Thinking...
                            </div>
                        </div>
                    )}

                </div>

                <div className="chat-input">
                    <input
                        type="text"
                        placeholder="Ask a question..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <button onClick={sendMessage} disabled={loading}>
                        Send
                    </button>
                </div>

            </div>
        </div>
    );
}

export default App;