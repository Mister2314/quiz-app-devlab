<h1 align="center">Quiz App</h1>

<p align="center"><b>A minimal-editorial multiple-choice quiz with answer choreography, progress storytelling and a result-screen reveal.</b></p>

<p align="center"><b>React 19 · TypeScript · Vite</b></p>

<p align="center"><a href="#quick-start">Quick start</a> &nbsp;·&nbsp; <a href="#features">Features</a> &nbsp;·&nbsp; <a href="#faq">FAQ</a></p>

<div align="center">

<img src="docs/demo.gif" alt="Quiz App — animated demo" width="700">

</div>

<div align="center">

<img src="screenshots/Main-page.png" alt="Quiz App — start screen" width="700">

<details>
<summary>More screenshots</summary>

| Question + feedback | Result reveal |
|---|---|
| <img src="screenshots/Question-page.png" alt="Question with answer feedback" width="420"> | <img src="screenshots/Result-page.png" alt="Scored result with new-best banner" width="420"> |

</details>

</div>

## Overview

A twelve-question quiz — start, question, result — with a typographic "Quiet Examination" art direction: paper background, ink text, one teal accent, hairline rules. Answers give immediate right/wrong feedback (glyph + tint, never color alone), a 30-second fuse runs under each question, a streak counter rewards consecutive correct answers, and the result screen counts the score up, then prints a corrections sheet explaining every wrong answer.

Built as part of the **DevLab** internship programme.

| Field | Detail |
| --- | --- |
| **Type** | Static SPA — built with Vite |
| **Live demo** | https://quiz-app-devlab.vercel.app |
| **Repository** | [Mister2314/quiz-app-devlab](https://github.com/Mister2314/quiz-app-devlab) |

## Features

- **Answer feedback choreography** — pressed option scales, correct/incorrect states show ✓/✕ glyphs with tint, others dim; a polite live region announces the outcome
- **Per-question timer** — a thin fuse bar runs under the progress; when it burns out the question is marked "out of time" and the quiz moves on
- **Streaks** — consecutive correct answers build a live streak chip; your best streak appears on the result screen
- **Corrections sheet** — every wrong answer is listed with what you picked, the correct answer and a one-line explanation, so the quiz teaches after it grades
- **Categories & difficulty** — each question is tagged HTML / CSS / JavaScript and easy / medium / hard
- **Shareable result** — one tap shares (or copies) a result line: score, percentage, best streak
- **Dark & light, no flash** — follows the system by default, a corner toggle persists your choice, and a pre-paint script means the first frame is always the right scheme
- **Works offline** — a small service worker caches the app shell; after the first visit the quiz runs with no network
- **Progress storytelling** — animated progress bar plus "Question 03" running header and a tabular "03 / 12" counter
- **Result-screen reveal** — rise-in headline, score counts up over 0.8s, then a "★ New best!" banner appears
- **Keyboard + focus** — keys 1–4 answer, Enter starts/restarts; focus moves to the screen heading on every screen change and to the first option on each new question
- **View Transitions API** — question/screen changes cross-fade with a slide (Chrome, Edge, Safari 18+, Firefox 144+), plain swap as fallback
- **Mobile-perfect single column** — 56–60px thumb-height options, safe-area padding, full-width CTAs, no hover-dependent affordances
- **Reduced motion** — `prefers-reduced-motion: reduce` disables every animation; the count-up renders instantly and transitions are skipped
- High score in `localStorage`; restart without reloading

## Stack

| Layer | Technology |
| --- | --- |
| UI | React 19 + TypeScript |
| Styling | Hand-written CSS with design tokens |
| Motion | CSS transitions + View Transitions API — zero animation dependencies |
| Build | Vite 6 |

## Quick Start

```bash
git clone https://github.com/Mister2314/quiz-app-devlab.git
cd quiz-app-devlab
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run lint     # eslint over src/
npm run typecheck
```

## FAQ

<details>
<summary><b>Where do the questions come from?</b></summary>

`src/quizData.ts` — the quiz logic never hard-codes a question, so the set can be swapped without touching `App.tsx`.

</details>

<details>
<summary><b>How does the answer feedback work?</b></summary>

Selecting an option locks the question, marks the correct answer and your pick with glyphs and tints, announces the result to screen readers, then advances after 1.5s. If the 30-second fuse burns out first, the question is recorded as "out of time" and shows up on the corrections sheet. The high score is written to `localStorage` on the result screen and survives a reload.

</details>

<details>
<summary><b>Does it work offline?</b></summary>

Yes, after the first visit. A small service worker (`public/sw.js`) caches the built app shell, so the quiz loads and plays with no network. It is a progressive enhancement — the app works exactly the same without it.

</details>

## Notes

Built during the **DevLab** internship programme — typographic hierarchy carries the interface, and every animated beat has a static reduced-motion equivalent.

## Author

**Xəyal Hüseynli** — Junior Front-End Developer

[Portfolio](https://hypnosdev.vercel.app) · [GitHub](https://github.com/Mister2314) · [LinkedIn](https://www.linkedin.com/in/x%C9%99yal-h%C3%BCseynli-3487b91ba/) · [xeyalhuseynli06@gmail.com](mailto:xeyalhuseynli06@gmail.com)
