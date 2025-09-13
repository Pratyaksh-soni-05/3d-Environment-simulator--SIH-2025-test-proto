import React, { useState } from "react";

const QUESTIONS = [
  {
    q: "If a big fire breaks out, what's the first safe action?",
    options: ["Try to extinguish by yourself", "Evacuate to the nearest exit and call for help", "Break a window and jump out"],
    correct: 1,
  },
  {
    q: "Which choice is wrong during smoke-filled room?",
    options: ["Stay low and crawl", "Cover your mouth and nose and exit", "Stand upright and run full speed"],
    correct: 2,
  },
  {
    q: "Should you use a fire extinguisher if you are untrained?",
    options: ["Yes, always", "Only if small fire and you're trained, otherwise evacuate", "No, never use it"],
    correct: 1,
  },
];

interface EndQuizProps {
  onClose: () => void;
  onScore: (s: number) => void;
}

export default function EndQuiz({ onClose, onScore }: EndQuizProps) {
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = (i: number, val: number) => {
    const copy = [...answers];
    copy[i] = val;
    setAnswers(copy);
  };

  const submit = () => {
    const sc = answers.reduce((acc, ans, i) => acc + (ans === QUESTIONS[i].correct ? 1 : 0), 0);
    setSubmitted(true);
    onScore(sc);
  };

  const score = answers.reduce((acc, ans, i) => acc + (ans === QUESTIONS[i].correct ? 1 : 0), 0);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Final Quiz</h2>
      {!submitted ? (
        <>
          {QUESTIONS.map((qq, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 600 }}>{i + 1}. {qq.q}</div>
              <div style={{ marginTop: 6 }}>
                {qq.options.map((opt, j) => (
                  <label key={j} style={{ display: "block", marginTop: 6 }}>
                    <input
                      type="radio"
                      name={"q" + i}
                      checked={answers[i] === j}
                      onChange={() => setAnswer(i, j)}
                    /> &nbsp; {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="button" onClick={onClose}>Close</button>
            <button className="button" onClick={submit}>Submit</button>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 18, marginBottom: 8 }}>You scored {score} / {QUESTIONS.length}</div>
          <div style={{ marginBottom: 12 }}>
            {QUESTIONS.map((q, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 600 }}>{i + 1}. {q.q}</div>
                <div>Correct answer: <strong>{q.options[q.correct]}</strong></div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="button" onClick={onClose}>Close</button>
          </div>
        </>
      )}
    </div>
  );
}



