import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExamWindow from './components/ExamWindow';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Exams from './components/Exams';
import Rules from './components/Rules';
import Results from './components/Results';
import sendEmail from './utils/sendEmail';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [examResults, setExamResults] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);

  useEffect(() => {
    const storedResults = localStorage.getItem('examResults');
    if (storedResults) {
      setExamResults(JSON.parse(storedResults));
    }
  }, []);

  const handleExamEnd = (status, report = null) => {
    const newResult = { status, report, timestamp: new Date().toISOString() };
    const updatedResults = [...examResults, newResult];
    setExamResults(updatedResults);
    localStorage.setItem('examResults', JSON.stringify(updatedResults));
    setCurrentView('results');
  };

  const handleReportGenerated = async (report) => {
    const result = await sendEmail(report);
    setEmailStatus(result);
    setTimeout(() => setEmailStatus(null), 5000); // Hide the popup after 5 seconds
  };

  return (
    <div className="App">
      {currentView !== 'exam' && <Navbar setCurrentView={setCurrentView} />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`content ${currentView === 'exam' ? 'full-screen' : ''}`}
      >
        {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
        {currentView === 'exams' && <Exams setCurrentView={setCurrentView} setSelectedExam={setSelectedExam} />}
        {currentView === 'exam' && (
          <ExamWindow 
            onExamEnd={handleExamEnd} 
            onReportGenerated={handleReportGenerated}
            selectedExam={selectedExam}
          />
        )}
        {currentView === 'rules' && <Rules />}
        {currentView === 'results' && <Results />}
      </motion.div>
      <AnimatePresence>
        {emailStatus && (
          <motion.div
            className={`email-status-popup ${emailStatus.success ? 'success' : 'error'}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            {emailStatus.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;