import { useEffect, useRef, useState } from "react";
import { quizData } from "./quizData";

type Screen = "start" | "quiz" | "result";

const TIMER_SECONDS = 15;
const USE_TIMER = false;

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const advanceTimer = useRef<number | undefined>(undefined);

  const currentQuestion = quizData[currentQuestionIndex];
  const progressPercentage = (currentQuestionIndex / quizData.length) * 100;

  useEffect(() => {
    return () => {
      if (advanceTimer.current !== undefined) {
        clearTimeout(advanceTimer.current);
      }
    };
  }, []);

  function initQuiz() {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsAnswered(false);
    setSelected(null);
  }

  function checkAnswer(selectedIndex: number) {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelected(selectedIndex);
    if (selectedIndex === currentQuestion.correctIndex) {
      setScore((s) => s + 1);
    }
    advanceTimer.current = window.setTimeout(() => {
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex((i) => i + 1);
        setIsAnswered(false);
        setSelected(null);
      } else {
        showResults();
      }
    }, 1500);
  }

  function showResults() {
    setScreen("result");
  }

  function saveHighScore(finalScore: number) {
    const highScore = Number(localStorage.getItem("quizHighScore")) || 0;
    if (finalScore > highScore) {
      localStorage.setItem("quizHighScore", String(finalScore));
    }
  }

  const percentage = (score / quizData.length) * 100;

  return (
    <div className="container">
      <div className="quiz-app">
        {screen === "start" && (
          <div id="start-screen" className="screen">
            <h1>Brain Teaser Quiz</h1>
            <p>Test your knowledge with these web development questions!</p>
            <button
              id="start-btn"
              className="btn"
              onClick={() => {
                initQuiz();
                setScreen("quiz");
              }}
            >
              Start Quiz
            </button>
          </div>
        )}

        {screen === "quiz" && (
          <div id="quiz-screen" className="screen">
            <div className="quiz-header">
              <div className="quiz-info">
                <span id="question-counter">
                  {`Question ${currentQuestionIndex + 1}/${quizData.length}`}
                </span>
                <span id="timer" className={USE_TIMER ? "" : "hide"}>
                  Time: <span id="time-left">{TIMER_SECONDS}</span>s
                </span>
              </div>
              <div className="progress-container">
                <div
                  id="progress-bar"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="quiz-body">
              <h2 id="question-text">{currentQuestion.question}</h2>
              <div id="options-container" className="options">
                {currentQuestion.options.map((option, index) => {
                  const classes = ["option"];
                  if (isAnswered) {
                    classes.push("disabled");
                    if (selected === index && selected !== currentQuestion.correctIndex) {
                      classes.push("incorrect");
                    }
                    if (index === currentQuestion.correctIndex) {
                      classes.push("correct");
                    }
                  }
                  return (
                    <button
                      key={index}
                      className={classes.join(" ")}
                      onClick={() => checkAnswer(index)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {screen === "result" && (
          <div id="result-screen" className="screen">
            <h1>Quiz Completed!</h1>
            <div className="score-container">
              <p>
                Your score: <span id="score">{score}</span>/
                <span id="total-questions">{quizData.length}</span>
              </p>
              <ResultMessage
                percentage={percentage}
                onSave={(finalScore) => saveHighScore(finalScore)}
                score={score}
              />
            </div>
            <button
              id="restart-btn"
              className="btn"
              onClick={() => {
                initQuiz();
                setScreen("quiz");
              }}
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultMessage({
  percentage,
  score,
  onSave,
}: {
  percentage: number;
  score: number;
  onSave: (score: number) => void;
}) {
  useEffect(() => {
    onSave(score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let message: string;
  if (percentage >= 80) {
    message = "Excellent! You're a web development expert!";
  } else if (percentage >= 60) {
    message = "Good job! You have solid knowledge.";
  } else if (percentage >= 40) {
    message = "Not bad. Keep learning and try again.";
  } else {
    message = "You might need more practice. Don't give up!";
  }
  return <div id="result-message">{message}</div>;
}
