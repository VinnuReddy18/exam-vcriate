import React from 'react';
import { motion } from 'framer-motion';

function Exams({ setCurrentView, setSelectedExam }) {
  const exams = [
    { id: 1, name: 'General Knowledge Quiz', description: 'Test your knowledge on various topics.' },
    { id: 2, name: 'Mathematics Test', description: 'Challenge your mathematical skills.' },
    { id: 3, name: 'Science Exam', description: 'Explore your understanding of scientific concepts.' },
  ];

  const handleExamSelect = (exam) => {
    setSelectedExam(exam.id);
    setCurrentView('exam');
  };

  return (
    <div className="exams">
      <h2>Available Exams</h2>
      <div className="exam-list">
        {exams.map(exam => (
          <motion.div
            key={exam.id}
            className="exam-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExamSelect(exam)}
          >
            <h3>{exam.name}</h3>
            <p>{exam.description}</p>
            <button>Start Exam</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Exams;