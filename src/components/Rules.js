import React from 'react';
import { motion } from 'framer-motion';

function Rules() {
  const rules = [
    "Remain in full-screen mode throughout the exam.",
    "Do not use any external resources or devices.",
    "Answer all questions to the best of your ability.",
    "You have 3 chances if you exit full-screen mode.",
    "Submit your exam before the timer runs out.",
  ];

  return (
    <div className="rules">
      <h2>Exam Rules</h2>
      <div className="rules-list">
        {rules.map((rule, index) => (
          <motion.div
            key={index}
            className="rule-item"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="rule-number">{index + 1}</span>
            <p>{rule}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Rules;