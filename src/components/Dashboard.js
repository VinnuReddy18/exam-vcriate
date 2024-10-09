import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Dashboard({ setCurrentView }) {
  const [analytics, setAnalytics] = useState({
    totalExams: 0,
    averageScore: 0,
    upcomingExams: 3,
  });

  useEffect(() => {
    const examResults = JSON.parse(localStorage.getItem('examResults') || '[]');
    
    const totalExams = examResults.length;
    const completedExams = examResults.filter(exam => exam.status === 'completed' && exam.report && exam.report.score !== undefined);
    const totalScore = completedExams.reduce((sum, exam) => sum + exam.report.score, 0);
    const averageScore = completedExams.length > 0 ? (totalScore / completedExams.length).toFixed(2) : 0;

    setAnalytics({
      totalExams,
      averageScore,
      upcomingExams: 3,
    });
  }, []);

  return (
    <div className="dashboard">
      <h1>Welcome to Vcriate</h1>
      <p>Your one-stop platform for online examinations</p>
      
      <motion.div 
        className="dashboard-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="stat-card">
          <h3>Total Exams Taken</h3>
          <p>{analytics.totalExams}</p>
        </div>
        <div className="stat-card">
          <h3>Average Score</h3>
          <p>{analytics.averageScore}%</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming Exams</h3>
          <p>{analytics.upcomingExams}</p>
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView('exams')}
      >
        View Available Exams
      </motion.button>
    </div>
  );
}

export default Dashboard;