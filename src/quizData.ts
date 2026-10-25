export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  category: "HTML" | "CSS" | "JavaScript";
  difficulty: "easy" | "medium" | "hard";
  /** Shown when reviewing wrong answers after the quiz. */
  explanation: string;
}

export const quizData: QuizQuestion[] = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyper Tool Modern Language",
    ],
    correctIndex: 0,
    category: "HTML",
    difficulty: "easy",
    explanation:
      "HTML is Hyper Text Markup Language — the markup vocabulary every web page is written in.",
  },
  {
    question: "Which tag is used to create a hyperlink in HTML?",
    options: ["<a>", "<link>", "<href>", "<hyperlink>"],
    correctIndex: 0,
    category: "HTML",
    difficulty: "easy",
    explanation:
      "<a> is the anchor element. <link> only connects external resources in the head; <href> is an attribute, not a tag.",
  },
  {
    question: "Which attribute makes an image accessible to screen readers?",
    options: ["title", "alt", "caption", "aria-label only"],
    correctIndex: 1,
    category: "HTML",
    difficulty: "easy",
    explanation:
      "The alt attribute carries a text alternative for images. aria-label works too, but alt is the semantic first choice for <img>.",
  },
  {
    question: "What does the <meta name=\"viewport\"> tag control?",
    options: [
      "The page's zoom level in print",
      "How the page scales on mobile devices",
      "The browser window size on desktop",
      "Search engine indexing",
    ],
    correctIndex: 1,
    category: "HTML",
    difficulty: "medium",
    explanation:
      "Without a viewport meta tag, mobile browsers render the page at a virtual desktop width and scale it down.",
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Cascading Style Sheet",
      "Colorful Style Sheet",
      "Creative Style Syntax",
      "Computer Style Sheet",
    ],
    correctIndex: 0,
    category: "CSS",
    difficulty: "easy",
    explanation:
      "Cascading Style Sheets — the 'cascade' is the rule that decides which declaration wins when several match.",
  },
  {
    question: "Which CSS property is used to change text color?",
    options: ["font-color", "text-color", "color", "text-style"],
    correctIndex: 2,
    category: "CSS",
    difficulty: "easy",
    explanation:
      "The property is simply color. font-color and text-color do not exist; text-style isn't a property either.",
  },
  {
    question: "Which unit scales with the user's chosen font size?",
    options: ["px", "rem", "vh", "pt"],
    correctIndex: 1,
    category: "CSS",
    difficulty: "medium",
    explanation:
      "1rem equals the root element's font size, which follows the browser's font-size setting — so text respects user preferences.",
  },
  {
    question: "What does `display: flex` change about child elements?",
    options: [
      "They stack vertically with margins collapsed",
      "They lay out along a main axis, growable and shrinkable",
      "They become absolutely positioned",
      "They inherit the parent's width exactly",
    ],
    correctIndex: 1,
    category: "CSS",
    difficulty: "medium",
    explanation:
      "A flex container lays children along one axis (row by default) and lets them flex — grow, shrink — to fill space.",
  },
  {
    question: "Which JavaScript keyword is used to declare a variable?",
    options: ["var", "let", "const", "All of the above"],
    correctIndex: 3,
    category: "JavaScript",
    difficulty: "easy",
    explanation:
      "All three declare variables: var (function-scoped, legacy), let (block-scoped) and const (block-scoped, cannot be reassigned).",
  },
  {
    question: "How do you write a single-line comment in JavaScript?",
    options: [
      "// This is a comment",
      "# This is a comment",
      "/* This is a comment */",
      "-- This is a comment",
    ],
    correctIndex: 0,
    category: "JavaScript",
    difficulty: "easy",
    explanation:
      "// comments to end of line; /* … */ is for multi-line blocks. # belongs to Python and shell scripts.",
  },
  {
    question: "What does `===` compare that `==` does not?",
    options: [
      "Values only, ignoring reference",
      "Both value and type, without coercion",
      "Memory addresses of objects",
      "Nothing — they are identical",
    ],
    correctIndex: 1,
    category: "JavaScript",
    difficulty: "medium",
    explanation:
      "=== is strict equality: no type coercion. `1 == \"1\"` is true, `1 === \"1\"` is false — that difference prevents a whole class of bugs.",
  },
  {
    question: "What does `Promise.all` do when one promise rejects?",
    options: [
      "Waits for all, then reports every rejection",
      "Resolves with the fulfilled values so far",
      "Rejects immediately with that first rejection",
      "Retries the failed promise once",
    ],
    correctIndex: 2,
    category: "JavaScript",
    difficulty: "hard",
    explanation:
      "Promise.all is fail-fast: the first rejection settles the whole call. Promise.allSettled is the variant that waits and reports every outcome.",
  },
];
