import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, Stats } from "@react-three/drei";
import Classroom from "./components/Classroom"; // ✅ capitalized file name
import Player from "./components/Player";
import EndQuiz from "./components/EndQuiz";

export default function App() {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"info" | "success" | "fail">("info");
  const [showQuiz, setShowQuiz] = useState(false);
  const [score, setScore] = useState(0);

  const showFeedback = (text: string, type: "info" | "success" | "fail" = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3500);
  };

  // Called when user finishes/escapes (success) or completes level (to show quiz)
  const onLevelComplete = (won: boolean) => {
    if (won) {
      showFeedback("You Escaped Safely! Good job.", "success");
      setTimeout(() => setShowQuiz(true), 800);
    } else {
      showFeedback("Wrong Choice! Trapped by Fire. Learn and try again.", "fail");
      setTimeout(() => setShowQuiz(true), 800);
    }
  };

  return (
    <div className="canvasWrap">
      <Canvas shadows camera={{ position: [0, 1.6, 6], fov: 75 }}>
        <ambientLight intensity={0.25} />
        {/* ✅ ensure Classroom component accepts props: onFeedback, onComplete, onAddScore */}
        <Classroom
          onFeedback={showFeedback}
          onComplete={onLevelComplete}
          onAddScore={() => setScore((s) => s + 1)}
        />
        <Player />
        <Stats />
        <Html center style={{ pointerEvents: "none" }}>
          {/* optional overlay in 3D space */}
        </Html>
      </Canvas>

      <div className="uiTop">
        <div className="button">Score: {score}</div>
        <div className="button">Use WASD + Mouse | Click objects</div>
      </div>

      <div className="hint">Click the canvas to lock pointer. Press Esc to release.</div>

      {message && (
        <div style={{ position: "absolute", top: "72px", left: "12px", zIndex: 60 }}>
          <div
            className="card"
            style={{
              padding: 12,
              background:
                messageType === "success"
                  ? "#ecfdf5"
                  : messageType === "fail"
                  ? "#fff1f2"
                  : "#ffffff",
            }}
          >
            <div
              style={{
                color:
                  messageType === "success"
                    ? "#065f46"
                    : messageType === "fail"
                    ? "#991b1b"
                    : "#111827",
              }}
            >
              {message}
            </div>
          </div>
        </div>
      )}

      {showQuiz && (
        <div className="modal">
          <div className="card">
            {/* ✅ ensure EndQuiz component has props: onClose, onScore */}
            <EndQuiz onClose={() => setShowQuiz(false)} onScore={(sc) => setScore(sc)} />
          </div>
        </div>
      )}
    </div>
  );
}


