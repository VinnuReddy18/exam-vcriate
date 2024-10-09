import React, { useState, useEffect, useCallback } from 'react';
import screenfull from 'screenfull';
import { motion, AnimatePresence } from 'framer-motion';
import Timer from './Timer';
import './ExamWindow.css'; 

const examQuestions = {
  1: [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris"
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
      correctAnswer: "Leonardo da Vinci"
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: "Pacific Ocean"
    }
  ],
  2: [
    {
      question: "What is 7 x 8?",
      options: ["54", "56", "62", "64"],
      correctAnswer: "56"
    },
    {
      question: "What is the square root of 144?",
      options: ["10", "12", "14", "16"],
      correctAnswer: "12"
    },
    {
      question: "What is 15% of 200?",
      options: ["20", "25", "30", "35"],
      correctAnswer: "30"
    }
  ],
  3: [
    {
      question: "What is the chemical symbol for gold?",
      options: ["Au", "Ag", "Fe", "Cu"],
      correctAnswer: "Au"
    },
    {
      question: "What is the largest planet in our solar system?",
      options: ["Mars", "Saturn", "Jupiter", "Neptune"],
      correctAnswer: "Jupiter"
    },
    {
      question: "What is the process by which plants make their own food?",
      options: ["Photosynthesis", "Respiration", "Fermentation", "Digestion"],
      correctAnswer: "Photosynthesis"
    }
  ]
};

function ExamWindow({ onExamEnd, onReportGenerated, selectedExam }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [examStartTime, setExamStartTime] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [examStarted, setExamStarted] = useState(false);
  const [isFullScreenViolation, setIsFullScreenViolation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [examReady, setExamReady] = useState(false);
  const MAX_VIOLATIONS = 3;
  const [questions, setQuestions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isTabSwitchWarningShown, setIsTabSwitchWarningShown] = useState(false);
  const [isExamTerminated, setIsExamTerminated] = useState(false);
  const [terminationReason, setTerminationReason] = useState('');

  useEffect(() => {
    setQuestions(examQuestions[selectedExam] || []);
  }, [selectedExam]);

  const validateInputs = () => {
    if (!userName.trim()) {
      alert('Please enter your name.');
      return false;
    }
    if (!userEmail.trim() || !userEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleViolation = useCallback(() => {
    setIsFullScreenViolation(true);
    setViolationCount(prevCount => prevCount + 1);
    
    if (violationCount + 1 >= MAX_VIOLATIONS) {
      const terminationReport = {
        userName,
        userEmail,
        userPhone,
        startTime: examStartTime,
        endTime: new Date(),
        duration: (new Date() - examStartTime) / 1000,
        status: 'terminated',
        reason: 'Exceeded full-screen violations'
      };
      onReportGenerated(terminationReport);
      onExamEnd('terminated', terminationReport);
    } else {
      alert(`Warning: You have exited full-screen mode. You have ${MAX_VIOLATIONS - (violationCount + 1)} chance(s) left before the exam is terminated.`);
    }
  }, [violationCount, onExamEnd, onReportGenerated, userName, userEmail, userPhone, examStartTime]);

  useEffect(() => {
    if (screenfull.isEnabled && examStarted) {
      const handleFullScreenChange = () => {
        if (!screenfull.isFullscreen) {
          handleViolation();
        } else {
          setIsFullScreenViolation(false);
        }
      };

      document.addEventListener(screenfull.raw.fullscreenchange, handleFullScreenChange);

      return () => {
        document.removeEventListener(screenfull.raw.fullscreenchange, handleFullScreenChange);
      };
    }
  }, [examStarted, handleViolation]);

  useEffect(() => {
    setProgress((currentQuestion / questions.length) * 100);
  }, [currentQuestion]);

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    const endTime = new Date();
    const score = calculateScore();
    const examName = getExamName(selectedExam);
    const report = {
      userName,
      userEmail,
      userPhone,
      examName,  
      startTime: examStartTime,
      endTime,
      duration: (endTime - examStartTime) / 1000,
      score: score,
      totalQuestions: questions.length,
      questions: questions.map((q, index) => ({
        question: q.question,
        answer: q.correctAnswer,
        userAnswer: userAnswers[index] || ''
      }))
    };
    onReportGenerated(report);
    
    if (screenfull.isEnabled && screenfull.isFullscreen) {
      screenfull.exit();
    }
    
    onExamEnd('completed', report);
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    setShowFeedback(true);
    setFeedbackMessage('Answer recorded!');
    setTimeout(() => setShowFeedback(false), 1500);
  };

  const startExam = () => {
    if (validateInputs()) {
      setExamReady(true);
    }
  };

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && examStarted) {
      terminateExam('Tab or window switched');
    }
  }, [examStarted]);

  const terminateExam = (reason) => {
    const endTime = new Date();
    const report = {
      userName,
      userEmail,
      userPhone,
      examName: getExamName(selectedExam),
      startTime: examStartTime,
      endTime,
      duration: (endTime - examStartTime) / 1000,
      status: 'terminated',
      reason: reason
    };
    onReportGenerated(report);
    setIsExamTerminated(true);
    setTerminationReason(reason);
    // Don't call onExamEnd here, we'll call it after showing the popup
  };

  useEffect(() => {
    if (examStarted) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [examStarted, handleVisibilityChange]);

  const enterFullScreenAndStartExam = () => {
    if (screenfull.isEnabled) {
      screenfull.request().then(() => {
        setIsFullScreen(true);
        setExamStarted(true);
        setExamStartTime(new Date());
      }).catch((error) => {
        console.error('Failed to enter full-screen mode:', error);
        alert('Failed to enter full-screen mode. The exam cannot proceed.');
      });
    } else {
      alert('Full-screen mode is not supported on this device. The exam cannot proceed.');
    }
  };

  const getExamName = (examId) => {
    switch(examId) {
      case 1:
        return 'General Knowledge Quiz';
      case 2:
        return 'Mathematics Test';
      case 3:
        return 'Science Exam';
      default:
        return 'Unnamed Exam';
    }
  };

  if (!examReady) {
    return (
      <div className="exam-window user-details-form">
        <h2>Enter Your Details</h2>
        <form onSubmit={(e) => { e.preventDefault(); startExam(); }}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              placeholder="Enter your email address"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone (optional)</label>
            <input
              id="phone"
              type="tel"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="Enter your phone number (optional)"
            />
          </div>
          <button type="submit" className="submit-btn">Proceed to Exam</button>
        </form>
      </div>
    );
  }

  if (examReady && !examStarted) {
    return (
      <motion.div 
        className="exam-window ready-to-start"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Ready to Start Your Exam</h2>
        <div className="ready-content">
          <p>The exam will be conducted in full-screen mode for the best experience and to maintain integrity.</p>
          <ul>
            <li>Ensure you have a stable internet connection</li>
            <li>Close all unnecessary applications</li>
            <li>Find a quiet place to take the exam</li>
            <li><strong>Warning:</strong> Switching tabs or windows will result in immediate exam termination</li>
          </ul>
          <motion.button 
            onClick={enterFullScreenAndStartExam} 
            className="start-exam-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enter Full-Screen and Start Exam
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (isFullScreenViolation) {
    return (
      <div className="exam-window warning">
        <h2>Full Screen Violation</h2>
        <p>You have exited full-screen mode. The exam will be terminated if you do not return to full-screen immediately.</p>
        <button onClick={() => {
          screenfull.request();
          setIsFullScreenViolation(false);
        }}>
          Return to Full Screen
        </button>
      </div>
    );
  }

  if (isExamTerminated) {
    return (
      <div className="exam-window termination-popup">
        <h2>Exam Terminated</h2>
        <p>Your exam has been terminated due to: {terminationReason}</p>
        <button onClick={() => onExamEnd('terminated', { reason: terminationReason })}>
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="exam-window">
      <div className="exam-header">
        <h2>Exam in Progress</h2>
        <Timer duration={3600} onTimeUp={handleSubmit} />
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="question-nav">
        {questions.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`
              ${currentQuestion === index ? 'active' : ''}
              ${userAnswers[index] ? 'answered' : ''}
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {index + 1}
          </motion.button>
        ))}
      </div>
      <motion.div 
        className="exam-content"
        key={currentQuestion}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        <h3>Question {currentQuestion + 1}</h3>
        <p className="question-text">{questions[currentQuestion].question}</p>
        <div className="options">
          {questions[currentQuestion].options.map((option, index) => (
            <motion.label 
              key={index} 
              className={`option ${userAnswers[currentQuestion] === option ? 'selected' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={option}
                checked={userAnswers[currentQuestion] === option}
                onChange={() => handleAnswerSelect(currentQuestion, option)}
              />
              <span>{option}</span>
            </motion.label>
          ))}
        </div>
      </motion.div>
      <div className="navigation-buttons">
        {currentQuestion > 0 && (
          <motion.button 
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Previous
          </motion.button>
        )}
        {currentQuestion < questions.length - 1 && (
          <motion.button 
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
        )}
        {currentQuestion === questions.length - 1 && (
          <motion.button 
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="submit-btn"
          >
            Submit Exam
          </motion.button>
        )}
      </div>
      <AnimatePresence>
        {showFeedback && (
          <motion.div 
            className="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {feedbackMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExamWindow;