import React, { useState, useEffect } from 'react';

    const quizData = {
      "quizTitle": "General Knowledge Quiz",
      "quizDescription": "Test your general knowledge with this quiz!",
      "questions": [
        {
          "question": "What is the capital of France?",
          "answers": ["Berlin", "Madrid", "Paris", "Rome"],
          "correctAnswer": "Paris"
        },
        {
          "question": "What is the largest planet in our solar system?",
          "answers": ["Earth", "Mars", "Jupiter", "Saturn"],
          "correctAnswer": "Jupiter"
        },
        {
          "question": "What is the chemical symbol for water?",
          "answers": ["H2O", "CO2", "O2", "NaCl"],
          "correctAnswer": "H2O"
        },
        {
          "question": "Who painted the Mona Lisa?",
          "answers": ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"],
          "correctAnswer": "Da Vinci"
        },
        {
          "question": "What is the highest mountain in the world?",
          "answers": ["K2", "Mount Kilimanjaro", "Mount Everest", "Mount Fuji"],
          "correctAnswer": "Mount Everest"
        }
      ]
    };

    function QuestionCard({ question, onAnswer, selectedAnswer, correctAnswer, showFeedback }) {
      const handleAnswer = (answer) => {
        onAnswer(answer);
      };

      return (
        <div className="question-card">
          <div className="question-text">{question.question}</div>
          {question.answers.map((answer, index) => (
            <button
              key={index}
              className={`answer-button ${showFeedback ? (answer === correctAnswer ? 'correct' : (selectedAnswer === answer ? 'incorrect' : '')) : ''}`}
              onClick={() => handleAnswer(answer)}
              disabled={showFeedback}
            >
              {answer}
            </button>
          ))}
          {showFeedback && <p>Correct Answer: {correctAnswer}</p>}
        </div>
      );
    }

    function App() {
      const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
      const [score, setScore] = useState(0);
      const [selectedAnswer, setSelectedAnswer] = useState(null);
      const [showFeedback, setShowFeedback] = useState(false);
      const [quizStarted, setQuizStarted] = useState(false);
      const [results, setResults] = useState([]);
      const [timer, setTimer] = useState(60);
      const [timeUp, setTimeUp] = useState(false);

      useEffect(() => {
        let interval;
        if (quizStarted && currentQuestionIndex !== null && !showFeedback && timer > 0) {
          interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
          }, 1000);
        } else if (timer === 0) {
          setTimeUp(true);
          handleAnswer(null);
        }
        return () => clearInterval(interval);
      }, [quizStarted, currentQuestionIndex, showFeedback, timer]);

      const startQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizStarted(true);
        setResults([]);
        setTimer(60);
        setTimeUp(false);
      };

      const handleAnswer = (answer) => {
        if (showFeedback) return;

        setSelectedAnswer(answer);
        setShowFeedback(true);

        const currentQuestion = quizData.questions[currentQuestionIndex];
        const isCorrect = answer === currentQuestion.correctAnswer;

        setResults(prevResults => [...prevResults, {
          question: currentQuestion.question,
          selectedAnswer: answer,
          correctAnswer: currentQuestion.correctAnswer,
          isCorrect: isCorrect,
          timeUp: timeUp
        }]);

        if (isCorrect) {
          setScore(prevScore => prevScore + 1);
        } else if (timeUp) {
          setScore(prevScore => prevScore - 1);
        }
      };

      const nextQuestion = () => {
        if (currentQuestionIndex < quizData.questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
          setTimer(60);
          setTimeUp(false);
        } else {
          setCurrentQuestionIndex(null);
          setQuizStarted(false);
        }
      };

      const currentQuestion = currentQuestionIndex !== null ? quizData.questions[currentQuestionIndex] : null;

      return (
        <div className="quiz-container">
          {!quizStarted ? (
            <div>
              <h1>{quizData.quizTitle}</h1>
              <p>{quizData.quizDescription}</p>
              <button className="start-button" onClick={startQuiz}>Start Quiz</button>
            </div>
          ) : currentQuestion ? (
            <div>
              <p>Time Remaining: {timer} seconds</p>
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                selectedAnswer={selectedAnswer}
                correctAnswer={currentQuestion.correctAnswer}
                showFeedback={showFeedback}
              />
              {showFeedback && <button onClick={nextQuestion}>Next Question</button>}
            </div>
          ) : (
            <div className="results-container">
              <h2>Quiz Results</h2>
              <p>Your final score: {score}</p>
              {results.map((result, index) => (
                <div key={index}>
                  <p>Question: {result.question}</p>
                  <p>Your Answer: {result.selectedAnswer || 'Skipped'}</p>
                  <p>Correct Answer: {result.correctAnswer}</p>
                  <p>Result: {result.isCorrect ? 'Correct' : 'Incorrect'}</p>
                  {result.timeUp && <p>Time Up</p>}
                  <hr />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    export default App;
