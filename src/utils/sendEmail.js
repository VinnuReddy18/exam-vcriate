const sendEmail = async (report) => {
  console.log('Sending email with report:', report);

  try {
    const response = await fetch('http://localhost:3001/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: report.userEmail,
        subject: 'Your Exam Results',
        body: generateEmailBody(report),
      }),
    });

    if (response.ok) {
      console.log('Email sent successfully');
      return { success: true, message: 'Email sent successfully' };
    } else {
      const errorData = await response.json();
      console.error('Failed to send email:', errorData);
      return { success: false, message: errorData.message || 'Failed to send email' };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Error sending email. Please try again later.' };
  }
};

const generateEmailBody = (report) => {
  let body = `
    Dear ${report.userName},

    Thank you for completing the exam. Here are your results:

    Start Time: ${report.startTime.toLocaleString()}
    End Time: ${report.endTime.toLocaleString()}
    Duration: ${report.duration} seconds

    Questions and Answers:
  `;

  report.questions.forEach((question, index) => {
    body += `
    Question ${index + 1}: ${question.question}
    Correct Answer: ${question.answer}
    Your Answer: ${question.userAnswer}
    `;
  });

  body += `
    Thank you for participating in the exam.

    Best regards,
    Vcriate Team
  `;

  return body;
};

export default sendEmail;