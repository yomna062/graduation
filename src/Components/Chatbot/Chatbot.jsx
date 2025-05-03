import React, { useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleSendMessage = () => {
    if (userMessage.trim() !== "") {
      setMessages((prev) => [
        ...prev,
        { text: userMessage, sender: "user" },
        { text: "Hi 👋", sender: "bot" },
      ]);
      setUserMessage("");
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-5 right-5 w-80 bg-white rounded-2xl shadow-2xl z-50 border border-blue-200">
          {/* العنوان */}
          <div className="bg-blue-500 text-white text-center py-2 rounded-t-2xl relative font-semibold text-sm">
            Smart Medical Help🤖
            <button
              onClick={handleCloseChat}
              className="absolute top-1 right-3 text-xl text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>

          {/* الرسائل */}
          <div className="h-80 overflow-y-auto p-3 border-b border-blue-100 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 flex items-end ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <span className="mr-2 text-xl">🤖</span>
                )}
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
          </div>

          {/* الإدخال */}
          <div className="flex items-center p-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="border border-blue-400 p-2 rounded-l-xl w-full focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
              placeholder="please write your message"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-xl hover:bg-blue-600 text-sm"
            >
              send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
