# Vcriate - Online Examination Platform

Vcriate is a React-based online examination platform that allows users to take exams in a secure, full-screen environment.


## Features

- User authentication
- Multiple choice questions
- Timed exams
- Full-screen mode enforcement
- Result calculation and display
- Email notification of results

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/exam-vcriate.git
   cd exam-vcriate
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```bash
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   ```
   Replace `your-email@gmail.com` and `your-email-password` with your actual Gmail credentials or app password.

## Running the Application

1. Start the backend server:
   ```bash
   npm run server
   ```

2. In a new terminal, start the React development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

1. On the home page, click on "View Available Exams" to see the list of exams.
2. Select an exam to start.
3. Enter your details and proceed to the exam.
4. The exam will be conducted in full-screen mode. Exiting full-screen mode may result in exam termination.
5. Answer all questions and submit the exam.
6. View your results on the Results page and receive an email with your exam report.

## Development

To run both the frontend and backend concurrently for development:
   ```bash
   npm run dev
   ```
---
