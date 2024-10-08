import React from 'react';
import { motion } from 'framer-motion';

function Navbar({ setCurrentView }) {
  return (
    <motion.nav
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <div className="logo">Vcriate</div>
      <ul>
        <li onClick={() => setCurrentView('dashboard')}>Dashboard</li>
        <li onClick={() => setCurrentView('exams')}>Exams</li>
        <li onClick={() => setCurrentView('rules')}>Rules</li>
        <li onClick={() => setCurrentView('results')}>Results</li>
      </ul>
    </motion.nav>
  );
}

export default Navbar;