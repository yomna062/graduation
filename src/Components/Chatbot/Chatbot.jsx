import React, { useState, useRef, useEffect } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const predefinedResponses = {
    hi: "Hi👋",
    hello: "Hello👋",
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchPrediction = async (symptom) => {
    const response = await fetch("https://model-ai-a1ki.onrender.com/predict/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symptom }),
    });
    return await response.json();
  };

  const handleSendMessage = async () => {
    const trimmedMessage = userMessage.trim();
    if (trimmedMessage === "") return;

    setMessages((prev) => [...prev, { text: trimmedMessage, sender: "user" }]);
    setIsLoading(true);

    const lower = trimmedMessage.toLowerCase();
    if (predefinedResponses[lower]) {
      setMessages((prev) => [
        ...prev,
        { text: predefinedResponses[lower], sender: "bot" },
      ]);
      setIsLoading(false);
      setUserMessage("");
      return;
    }

    try {
      const data = await fetchPrediction(trimmedMessage);

      if (data?.prediction) {
        setMessages((prev) => [
          ...prev,
          { text: `Prediction: ${data.prediction}`, sender: "bot" },
          { text: data.note || "Note not available", sender: "bot" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "Sorry, I couldn't determine your condition.", sender: "bot" },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ There was a problem reaching the service. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
      setUserMessage("");
    }
  };

  const handleCloseChat = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-5 right-5 w-80 bg-white rounded-2xl shadow-2xl z-50 border border-blue-200">
          {/* Header */}
          <div className="bg-blue-500 text-white text-center py-2 rounded-t-2xl relative font-semibold text-sm">
            Smart Medical Help 🤖
            <button
              onClick={handleCloseChat}
              className="absolute top-1 right-3 text-xl text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-3 border-b border-blue-100 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 flex items-end ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && <span className="mr-2 text-xl">🤖</span>}
                <div
                  className={`max-w-xs p-2 px-3 rounded-xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-center mt-2">
                <div className="text-sm text-gray-500 animate-pulse">
                  Loading...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center p-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="border border-blue-400 p-2 rounded-l-xl w-full focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
              placeholder="Please write your message"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || userMessage.trim() === ""}
              className={`bg-blue-500 text-white px-4 py-2 rounded-r-xl hover:bg-blue-600 text-sm ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
