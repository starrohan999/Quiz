import React, { useState, useEffect, useCallback } from 'react';
import { QuizData } from '../Data/QuizData';
import QuizResult from './QuizResult';

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [clickedOption, setClickedOption] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // Setting the timer for 10 seconds

  const updateScore = useCallback(() => {
    if (clickedOption === QuizData[currentQuestion].answer) {
      setScore(prevScore => prevScore + 1);
    }
  }, [clickedOption, currentQuestion]);

  const changeQuestion = useCallback(() => {
    updateScore();
    if (currentQuestion < QuizData.length - 1) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
      setClickedOption(0);
      setTimeLeft(10); // Reset timer when changing question
    } else {
      setShowResult(true);
    }
  }, [currentQuestion, updateScore]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime === 1) {
          changeQuestion();
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clear the interval when the component unmounts or the question changes
    return () => clearInterval(timer);
  }, [changeQuestion]);

  useEffect(() => {
    // Reset the timer when the current question changes
    setTimeLeft(10);
  }, [currentQuestion]);

  const resetAll = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setClickedOption(0);
    setScore(0);
    setTimeLeft(10); // Reset timer
  };

  return (
    <div>
      <p className="heading-txt">Quiz APP</p>
      <div className="container">
        {showResult ? (
          <QuizResult score={score} totalScore={QuizData.length} tryAgain={resetAll} />
        ) : (
          <>
            <div className="question">
              <span id="question-number">{currentQuestion + 1}. </span>
              <span id="question-txt">{QuizData[currentQuestion].question}</span>
            </div>
            <div className="option-container">
              {QuizData[currentQuestion].options.map((option, i) => (
                <button
                  className={`option-btn ${clickedOption === i + 1 ? 'checked' : ''}`}
                  key={i}
                  onClick={() => setClickedOption(i + 1)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="timer">
              Time left: {timeLeft} seconds
            </div>
            <input type="button" value="Next" id="next-button" onClick={changeQuestion} />
          </>
        )}
      </div>
    </div>
  );
}

export default Quiz;
