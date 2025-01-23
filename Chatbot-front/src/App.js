import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [socket, setSocket] = useState(null);
    const [isTyping, setIsTyping] = useState(false);  
    const messagesEndRef = useRef(null);

     useEffect(() => {
        const ws = new WebSocket("ws://127.0.0.1:8000/ws");
        setSocket(ws);

         ws.onmessage = (event) => {
            setIsTyping(false);  
            setMessages((prev) => [...prev, { sender: "bot", text: event.data }]);
        };

         return () => ws.close();
    }, []);

     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

     const sendMessage = () => {
        if (socket && inputValue.trim()) {
            setMessages((prev) => [...prev, { sender: "user", text: inputValue }]);
            setInputValue("");
            setIsTyping(true);  
            socket.send(inputValue);
        }
    };

    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center py-4"
            style={{
                backgroundColor: "#1a1a1a",
                color: "white",
                minHeight: "100vh",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h1 className="text-center mb-4" style={{ fontSize: "1.8rem" }}>
                Hello, What can I help with?
            </h1>
            <div
                className="border rounded shadow-lg p-3 mb-3"
                style={{
                    backgroundColor: "#2c2c2c",
                    width: "100%",
                    maxWidth: "600px",
                    height: "450px",
                    overflowY: "scroll",
                    borderColor: "#444",
                }}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`d-flex mb-3 ${
                            msg.sender === "user" ? "justify-content-end" : "justify-content-start"
                        }`}
                    >
                        <div
                            className={`p-3 rounded-pill ${
                                msg.sender === "user"
                                    ? "bg-primary text-white"
                                    : "bg-secondary text-light"
                            }`}
                            style={{
                                maxWidth: "75%",
                                wordWrap: "break-word",
                                fontSize: "14px",
                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                            }}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="d-flex mb-3 justify-content-start">
                        <div
                            className="p-3 rounded-pill bg-secondary text-light d-flex align-items-center"
                            style={{
                                maxWidth: "75%",
                                fontSize: "14px",
                                fontStyle: "italic",
                            }}
                        >
                            <div className="spinner-border spinner-border-sm text-light me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            Bot is typing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef}></div>
            </div>
            <div
                className="input-group"
                style={{
                    width: "100%",
                    maxWidth: "600px",
                    borderRadius: "30px",
                }}
            >
                <input
                    type="text"
                    className="form-control"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    style={{
                        backgroundColor: "#2c2c2c",
                        color: "white",
                        borderColor: "#444",
                        borderRadius: "20px 0 0 20px",
                    }}
                />
                <button
                    className="btn btn-primary"
                    onClick={sendMessage}
                    style={{
                        borderRadius: "0 20px 20px 0",
                        padding: "10px 20px",
                        fontWeight: "bold",
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default App;
