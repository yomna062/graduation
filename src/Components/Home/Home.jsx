import React, { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import MainSection from "../MainSection/MainSection";
import SearchBar from "../SearchBar/SearchBar";
import Service from "../Service/Service";
import Specielities from "../Specielities/Specielities";
import MostSearched from "../MostSearched/MostSearched";
import AboutSec from "../AboutSec/AboutSec";
import Feedback from "../Feedback/Feedback";
import ChatBot from "../ChatBot/ChatBot"; // ✅ استيراد الشات بوت

export default function Home() {
  const [showChatBot, setShowChatBot] = useState(false); // حالة التحكم في ظهور الشات

  const toggleChatBot = () => {
    setShowChatBot(!showChatBot); // تبديل الحالة بين الظهور والإخفاء
  };

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      {/* Main Section */}
      <MainSection />
      
      {/* Other Sections */}
      <SearchBar />
      <Service />
      <Specielities />
      <MostSearched />
      <AboutSec />
      <Feedback />

      {/* ChatBot Icon */}
      <motion.div
        className="fixed bottom-5 right-5 z-10 p-4 bg-blue-500 rounded-full cursor-pointer shadow-lg"
        onClick={toggleChatBot}
        whileHover={{ scale: 1.1 }} // تأثير التكبير عند المرور على الأيقونة
        transition={{ duration: 0.3 }}
      >
        <img
          src="https://img.icons8.com/ios/452/chat.png" // رابط الأيقونة (يمكنك تغييره)
          alt="Chat Icon"
          className="w-10 h-10" // حجم الأيقونة
        />
      </motion.div>

      {/* ChatBot */}
      {showChatBot && (
        <motion.div
          className="fixed bottom-16 right-5 z-10 w-80 p-4 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ChatBot />
        </motion.div>
      )}
    </>
  );
}
