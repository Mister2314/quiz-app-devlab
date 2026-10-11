# Quiz App

**A multiple-choice quiz with immediate feedback, live progress and a scored result screen.**

![HTML5](https://img.shields.io/badge/HTML5-e34f26?style=flat-square&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572b6?style=flat-square&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-f7df1e?style=flat-square&logoColor=white)

## Overview

A three-screen quiz app that walks through a question set one question at a time. Answer, get instant feedback, see where you are in the set, and finish on a scored summary.

Questions live in a separate `quiz_data.js` file, so the question set can be swapped or extended without touching the quiz logic — the app just reads the array.

Built as part of the DevLab internship programme.

## Features

- Three screens — start, question and result — swapped in place
- Questions loaded from a separate `quiz_data.js` data file
- Immediate right / wrong feedback on each answer
- Live question counter and progress indicator
- Score summary on the result screen
- Restart without reloading the page
- High score kept in `localStorage`

## Tech Stack

| Layer | Technology |
| --- | --- |
| Markup | HTML5 |
| Styling | CSS3 |
| Logic | Vanilla JavaScript |
| Data | `quiz_data.js` question set |

## Getting Started

No build step and no dependencies — clone the repo and open the entry file, or serve the folder locally:

```bash
git clone https://github.com/Mister2314/quiz-app-devlab.git
cd quiz-app-devlab

# Option 1 — open it directly
start index.html      # Windows
open  index.html      # macOS

# Option 2 — serve it locally
npx serve .
```

## Project Structure

```
index.html — the three screens
script.js — quiz flow, scoring and screen switching
quiz_data.js — questions, options and correct answers
style.css — layout and state styling
screenshots/ — start, question and result screens
```

## Notes

Built during the **DevLab** internship programme. Keeping the questions in their own file meant the app itself never had to change as the question set grew.

## Author

**Xəyal Hüseynli** — Junior Front-End Developer

[Portfolio](https://hypnosdev.vercel.app) · [GitHub](https://github.com/Mister2314) · [LinkedIn](https://www.linkedin.com/in/x%C9%99yal-h%C3%BCseynli-3487b91ba/) · [xeyalhuseynli06@gmail.com](mailto:xeyalhuseynli06@gmail.com)
