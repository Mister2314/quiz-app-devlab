import { useCallback, useEffect, useRef, useState } from "react";
import { quizData } from "./quizData";

type Screen = "start" | "quiz" | "result";
type Theme = "light" | "dark";

const ADVANCE_DELAY = 1500;
const QUESTION_SECONDS = 30;

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

function readStoredTheme(): Theme {
  const saved = localStorage.getItem("quizTheme");
  return saved === "dark" ? "dark" : "light";
}

interface AnswerRecord {
  questionIndex: number;
  /** null = ran out of time */
  selectedIndex: number | null;
  correct: boolean;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const [streak, setStreak] = useState(0);
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const advanceTimer = useRef<number | undefined>(undefined);
  // Latest `answer`, readable from timers without re-arming them.
  const answerRef = useRef<(index: number | null) => void>(() => {});

  const screenHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const firstOptionRef = useRef<HTMLButtonElement | null>(null);

  const currentQuestion = quizData[currentQuestionIndex];
  const progressPercentage = (currentQuestionIndex / quizData.length) * 100;
  const score = answers.filter((a) => a.correct).length;
  const bestStreak = answers.reduce(
    (best, a) => {
      return a.correct
        ? { streak: best.streak + 1, max: Math.max(best.max, best.streak + 1) }
        : { streak: 0, max: best.max };
    },
    { streak: 0, max: 0 },
  ).max;

  const showResults = useCallback(() => {
    withViewTransition(() => setScreen("result"));
  }, []);

  const advance = useCallback(() => {
    if (currentQuestionIndex < quizData.length - 1) {
      withViewTransition(() => {
        setCurrentQuestionIndex((i) => i + 1);
        setIsAnswered(false);
        setSelected(null);
        setTimeLeft(QUESTION_SECONDS);
      });
    } else {
      showResults();
    }
  }, [currentQuestionIndex, showResults]);

  const answer = useCallback(
    (selectedIndex: number | null) => {
      if (isAnswered) return;
      const correct = selectedIndex === currentQuestion.correctIndex;
      setIsAnswered(true);
      setSelected(selectedIndex);
      setStreak(correct ? streak + 1 : 0);
      setAnswers((prev) => [
        ...prev,
        { questionIndex: currentQuestionIndex, selectedIndex, correct },
      ]);
      advanceTimer.current = window.setTimeout(advance, ADVANCE_DELAY);
    },
    [isAnswered, currentQuestion, currentQuestionIndex, streak, advance],
  );

  // Latest `answer`, readable from timers without re-arming them.
  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  const initQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsAnswered(false);
    setSelected(null);
    setTimeLeft(QUESTION_SECONDS);
    setStreak(0);
  }, []);

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

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("quizTheme", next);
    document.documentElement.dataset.theme = next;
  }

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
  }, [currentQuestionIndex, screen, isAnswered]);

  // Per-question countdown: ticks only while the question is live. Expiry is
  // dispatched from the timeout callback, not the effect body, so state updates
  // never cascade synchronously inside an effect.
  useEffect(() => {
    if (screen !== "quiz" || isAnswered) return;
    if (timeLeft <= 0) {
      const expiry = window.setTimeout(() => answerRef.current(null), 0);
      return () => clearTimeout(expiry);
    }
    const t = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [screen, isAnswered, timeLeft, currentQuestionIndex]);

  // Keyboard navigation: 1–4 to answer.
  useEffect(() => {
    if (screen !== "quiz") return;
    function onKeyDown(event: KeyboardEvent) {
      const n = Number(event.key);
      if (!isAnswered && n >= 1 && n <= currentQuestion.options.length) {
        answer(n - 1);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [screen, isAnswered, currentQuestion, answer]);

  const percentage = Math.round((score / quizData.length) * 100);
  const wrongAnswers = answers.filter((a) => !a.correct);

  return (
    <div className="container">
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        title="Toggle theme"
      >
        {theme === "dark" ? "☀" : "☾"}
      </button>
      <div className="quiz-app">
        {screen === "start" && (
          <div id="start-screen" className="screen">
            <p className="kicker">DevLab · Brain Teaser</p>
            <h1 ref={screenHeadingRef} tabIndex={-1} className="screen-heading">
              Quiet Examination
            </h1>
            <p className="screen-lede">
              Twelve web-development questions — HTML, CSS and JavaScript, from
              easy to hard. Answer with a click, keys 1–4, and 30 seconds per
              question.
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
                <span className="quiz-meta">
                  {streak >= 2 && (
                    <span className="streak-chip" title="Answer streak">
                      {streak} in a row
                    </span>
                  )}
                  <span className="question-counter">
                    {String(currentQuestionIndex + 1).padStart(2, "0")} /{" "}
                    {String(quizData.length).padStart(2, "0")}
                  </span>
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
              <div
                className={`timer-bar${timeLeft <= 5 ? " timer-low" : ""}`}
                aria-hidden="true"
              >
                <div
                  className="timer-fill"
                  style={{
                    width: `${(timeLeft / QUESTION_SECONDS) * 100}%`,
                    transitionDuration: timeLeft <= 5 ? "1000ms" : "980ms",
                  }}
                />
              </div>
            </div>

            <div className="quiz-body">
              <p className="question-tags">
                <span className="tag">{currentQuestion.category}</span>
                <span className={`tag tag-${currentQuestion.difficulty}`}>
                  {currentQuestion.difficulty}
                </span>
              </p>
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
                      onClick={() => answer(index)}
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
                  ? selected === null
                    ? "Time is up."
                    : selected === currentQuestion.correctIndex
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
            bestStreak={bestStreak}
            wrongAnswers={wrongAnswers}
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
  bestStreak,
  wrongAnswers,
  headingRef,
  onRestart,
}: {
  score: number;
  total: number;
  percentage: number;
  bestStreak: number;
  wrongAnswers: AnswerRecord[];
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onRestart: () => void;
}) {
  const [displayed, setDisplayed] = useState(prefersReducedMotion() ? score : 0);
  const [bannerVisible, setBannerVisible] = useState(prefersReducedMotion());
  const [copied, setCopied] = useState(false);
  // Previous best, captured once; promoted in an effect when this run beats it.
  const [highScore] = useState(
    () => Number(localStorage.getItem("quizHighScore")) || 0,
  );
  // Derived, not stored: this run beat the previous best.
  const isNewBest = score > highScore && score > 0;

  useEffect(() => {
    if (score > highScore) {
      localStorage.setItem("quizHighScore", String(score));
    }
  }, [score, highScore]);

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

  async function shareResult() {
    const text = `Quiet Examination — ${score}/${total} (${percentage}%), best streak ${bestStreak}. Think you can grade higher?`;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // user cancelled the share sheet — nothing to report
    }
  }

  let message: string;
  if (percentage >= 80) {
    message = "Grade A — no corrections needed. The examiner is impressed.";
  } else if (percentage >= 60) {
    message = "Solid pass. A margin note or two, nothing structural.";
  } else if (percentage >= 40) {
    message = "Passed with red ink. Revisit the marked answers below.";
  } else {
    message = "Resit recommended. The paper is graded honestly.";
  }

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
        <p className="result-facts">
          {bestStreak >= 2 && <span>Best streak: {bestStreak}</span>}
          <span>
            {wrongAnswers.length === 0
              ? "Every answer held up."
              : `${wrongAnswers.length} answer${wrongAnswers.length === 1 ? "" : "s"} marked for review`}
          </span>
        </p>
        <p className={`high-score-banner${bannerVisible ? " visible" : ""}`}>
          {isNewBest ? "★ New best!" : `Best: ${Math.max(highScore, score)} / ${total}`}
        </p>
      </div>

      {wrongAnswers.length > 0 && (
        <section className="review" aria-labelledby="review-heading">
          <h2 id="review-heading" className="review-heading">
            Corrections — the marked answers
          </h2>
          <ol className="review-list">
            {wrongAnswers.map((record) => {
              const q = quizData[record.questionIndex];
              return (
                <li key={record.questionIndex} className="review-item">
                  <p className="review-question">{q.question}</p>
                  <p className="review-your-answer">
                    {record.selectedIndex === null
                      ? "You: out of time"
                      : `You: ${q.options[record.selectedIndex]}`}
                  </p>
                  <p className="review-correct-answer">
                    Correct: {q.options[q.correctIndex]}
                  </p>
                  <p className="review-explanation">{q.explanation}</p>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <div className="result-actions">
        <button id="restart-btn" className="btn" onClick={onRestart}>
          Restart Quiz
        </button>
        <button className="btn btn-ghost" onClick={shareResult}>
          {copied ? "Copied ✓" : "Share result"}
        </button>
      </div>
    </div>
  );
}
