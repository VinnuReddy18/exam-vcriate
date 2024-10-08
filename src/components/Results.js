import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Results() {
  const [examResults, setExamResults] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    const storedResults = localStorage.getItem('examResults');
    if (storedResults) {
      setExamResults(JSON.parse(storedResults));
    }
  }, []);

  const handleExamClick = (exam) => {
    setSelectedExam(exam);
  };

  const closePopup = () => {
    setSelectedExam(null);
  };

  const deleteResult = (index, e) => {
    e.stopPropagation();
    const updatedResults = examResults.filter((_, i) => i !== index);
    setExamResults(updatedResults);
    localStorage.setItem('examResults', JSON.stringify(updatedResults));
  };

  return (
    <div className="results">
      <h2>Exam Results</h2>
      {examResults.length === 0 ? (
        <p className="no-results">No exam results available.</p>
      ) : (
        <div className="results-list">
          {examResults.map((exam, index) => (
            <motion.div
              key={index}
              className="result-item"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExamClick(exam)}
            >
              <div className="result-content">
                <p className="result-date">{new Date(exam.timestamp).toLocaleString()}</p>
                <p className="result-status">Status: <span className={exam.status}>{exam.status}</span></p>
                {exam.report && exam.report.score !== undefined ? (
                  <p className="result-score">Score: {exam.report.score} / {exam.report.totalQuestions}</p>
                ) : (
                  <p className="result-score">Score: N/A</p>
                )}
              </div>
              <button className="delete-btn" onClick={(e) => deleteResult(index, e)}>×</button>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedExam && (
          <motion.div
            className="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
          >
            <motion.div
              className="popup-content"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={closePopup}>&times;</button>
              <h3>Detailed Exam Results</h3>
              <div className="result-details">
                <p><strong>Date:</strong> {new Date(selectedExam.timestamp).toLocaleString()}</p>
                <p><strong>Status:</strong> <span className={selectedExam.status}>{selectedExam.status}</span></p>
                {selectedExam.report && (
                  <>
                    <p><strong>Name:</strong> {selectedExam.report.userName}</p>
                    <p><strong>Email:</strong> {selectedExam.report.userEmail}</p>
                    {selectedExam.report.score !== undefined ? (
                      <p><strong>Score:</strong> {selectedExam.report.score} / {selectedExam.report.totalQuestions}</p>
                    ) : (
                      <p><strong>Score:</strong> N/A</p>
                    )}
                    <p><strong>Duration:</strong> {selectedExam.report.duration} seconds</p>
                    {selectedExam.report.reason && (
                      <p><strong>Termination Reason:</strong> {selectedExam.report.reason}</p>
                    )}
                    {selectedExam.report.questions && (
                      <div className="questions-list">
                        <h4>Questions:</h4>
                        {selectedExam.report.questions.map((q, index) => (
                          <div key={index} className="question-item">
                            <p><strong>Question {index + 1}:</strong> {q.question}</p>
                            <p><strong>Your Answer:</strong> {q.userAnswer}</p>
                            <p><strong>Correct Answer:</strong> {q.answer}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Results;