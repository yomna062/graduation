import React from 'react';
import style from './Layout.module.css';
import Navbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/Footer.jsx';
import { Outlet, useLocation } from 'react-router-dom';
import NestedNavbar from '../NestedNavbar/NestedNavbar.jsx';
import { AnimatePresence, motion } from 'framer-motion';

export default function Layout() {
  const location = useLocation();

  // ✅ تعريف الأنيميشن
  const pageTransition = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  return (
    <>
      <NestedNavbar />

      {/* قم بإزالة AnimatePresence هنا، أو أضف شرطًا لتحديد متى يتم استخدامه */}
      <motion.div
        key={location.pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
        className="mt-4 py-12"
      >
        <Outlet />
      </motion.div>

      <Footer />
    </>
  );
}
