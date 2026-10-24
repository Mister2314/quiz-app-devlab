import { useCallback, useEffect, useRef, useState } from "react";
import { quizData } from "./quizData";

type Screen = "start" | "quiz" | "result";

const ADVANCE_DELAY = 1500;

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Wrap a DOM update in the View Transitions API when available and wanted. */
function withViewTransition(update: () => void) {
  if (prefersReducedMotion() || typeof document.startViewTransition !== "function") {
    update();
    return;
  }
  document.startViewTransition(update);
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const advanceTimer = useRef<number | undefined>(undefined);

  const screenHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const firstOptionRef = useRef<HTMLButtonElement | null>(null);

  const currentQuestion = quizData[currentQuestionIndex];
  const progressPercentage = (currentQuestionIndex / quizData.length) * 100;

  useEffect(() => {
    return () => {
      if (advanceTimer.current !== undefined) {
        clearTimeout(advanceTimer.current);
      }
    };
  }, []);

  // Focus management: move focus to the screen heading on every screen change.
  useEffect(() => {
    screenHeadingRef.current?.focus();
  }, [screen]);

  // Focus management: put keyboard focus on the first option when a new question loads.
  useEffect(() => {
    if (screen === "quiz" && !isAnswered) {
      firstOptionRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, screen]);

  const initQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsAnswered(false);
    setSelected(null);
  }, []);

  const showResults = useCallback(() => {
    withViewTransition(() => setScreen("result"));
  }, []);

  function checkAnswer(selectedIndex: number) {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelected(selectedIndex);
    if (selectedIndex === currentQuestion.correctIndex) {
      setScore((s) => s + 1);
    }
    advanceTimer.current = window.setTimeout(() => {
      if (currentQuestionIndex < quizData.length - 1) {
        withViewTransition(() => {
          setCurrentQuestionIndex((i) => i + 1);
          setIsAnswered(false);
          setSelected(null);
        });
      } else {
        showResults();
      }
    }, ADVANCE_DELAY);
  }

  function startQuiz() {
    initQuiz();
    withViewTransition(() => setScreen("quiz"));
  }

  function restartQuiz() {
    if (advanceTimer.current !== undefined) {
      clearTimeout(advanceTimer.current);
    }
    startQuiz();
  }

  // Keyboard navigation: 1–4 to answer.
  useEffect(() => {
    if (screen !== "quiz") return;
    function onKeyDown(event: KeyboardEvent) {
      const n = Number(event.key);
      if (!isAnswered && n >= 1 && n <= currentQuestion.options.length) {
        checkAnswer(n - 1);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, isAnswered, currentQuestionIndex]);

  const percentage = (score / quizData.length) * 100;

  return (
    <div className="container">
      <div className="quiz-app">
        {screen === "start" && (
          <div id="start-screen" className="screen">
            <p className="kicker">DevLab · Brain Teaser</p>
            <h1 ref={screenHeadingRef} tabIndex={-1} className="screen-heading">
              Quiet Examination
            </h1>
            <p className="screen-lede">
              Six web-development questions. Answer with a click or keys 1–4.
            </p>
            <button id="start-btn" className="btn" onClick={startQuiz}>
              Start Quiz
            </button>
            <HighScoreBanner />
          </div>
        )}

        {screen === "quiz" && (
          <div id="quiz-screen" className="screen">
            <div className="quiz-header">
              <div className="quiz-info">
                <span className="question-number">
                  Question {String(currentQuestionIndex + 1).padStart(2, "0")}
                </span>
                <span className="question-counter">
                  {String(currentQuestionIndex + 1).padStart(2, "0")} /{" "}
                  {String(quizData.length).padStart(2, "0")}
                </span>
              </div>
              <div
                className="progress-container"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={quizData.length}
                aria-valuenow={currentQuestionIndex}
                aria-label="Quiz progress"
              >
                <div
                  id="progress-bar"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="quiz-body">
              <h2
                id="question-text"
                ref={screenHeadingRef}
                tabIndex={-1}
                className="question-heading"
              >
                {currentQuestion.question}
              </h2>
              <div
                id="options-container"
                className="options"
                role="group"
                aria-label="Answer options"
              >
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
                  const mark =
                    isAnswered && index === currentQuestion.correctIndex
                      ? "✓"
                      : isAnswered && selected === index
                        ? "✕"
                        : String(index + 1);
                  return (
                    <button
                      key={index}
                      ref={index === 0 ? firstOptionRef : undefined}
                      className={classes.join(" ")}
                      onClick={() => checkAnswer(index)}
                      aria-disabled={isAnswered || undefined}
                    >
                      <span className="option-key" aria-hidden="true">
                        {mark}
                      </span>
                      <span className="option-text">{option}</span>
                    </button>
                  );
                })}
              </div>
              <p className="visually-hidden" role="status" aria-live="polite">
                {isAnswered
                  ? selected === currentQuestion.correctIndex
                    ? "Correct."
                    : `Incorrect. The answer is: ${currentQuestion.options[currentQuestion.correctIndex]}`
                  : ""}
              </p>
            </div>
          </div>
        )}

        {screen === "result" && (
          <ResultScreen
            score={score}
            total={quizData.length}
            percentage={percentage}
            headingRef={screenHeadingRef}
            onRestart={restartQuiz}
          />
        )}
      </div>
    </div>
  );
}

function HighScoreBanner() {
  const highScore = Number(localStorage.getItem("quizHighScore")) || 0;
  if (highScore <= 0) return null;
  return (
    <p className="high-score-banner">
      Best so far: <strong>{highScore}</strong> / {quizData.length}
    </p>
  );
}

function ResultScreen({
  score,
  total,
  percentage,
  headingRef,
  onRestart,
}: {
  score: number;
  total: number;
  percentage: number;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onRestart: () => void;
}) {
  const [displayed, setDisplayed] = useState(prefersReducedMotion() ? score : 0);
  const [bannerVisible, setBannerVisible] = useState(prefersReducedMotion());
  const prevHigh = useRef(Number(localStorage.getItem("quizHighScore")) || 0);

  useEffect(() => {
    if (score > prevHigh.current) {
      localStorage.setItem("quizHighScore", String(score));
    }
  }, [score]);

  // Reveal choreography: count-up, then the high-score banner.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    const started = performance.now();
    const duration = 800;
    const tick = (now: number) => {
      const t = Math.min((now - started) / duration, 1);
      setDisplayed(Math.round(t * score));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setBannerVisible(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

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

  const isNewBest = score > prevHigh.current && score > 0;

  return (
    <div id="result-screen" className="screen">
      <p className="kicker">Examination complete</p>
      <h1 ref={headingRef} tabIndex={-1} className="screen-heading result-heading">
        {score} / {total}
      </h1>
      <div className="score-container">
        <p className="score-line">
          Your score: <span id="score">{displayed}</span>/
          <span id="total-questions">{total}</span>
        </p>
        <p id="result-message">{message}</p>
        <p className={`high-score-banner${bannerVisible ? " visible" : ""}`}>
          {isNewBest ? "★ New best!" : `Best: ${Math.max(prevHigh.current, score)} / ${total}`}
        </p>
      </div>
      <button id="restart-btn" className="btn" onClick={onRestart}>
        Restart Quiz
      </button>
    </div>
  );
}
