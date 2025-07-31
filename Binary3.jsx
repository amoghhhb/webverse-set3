"use client"

import { useState, useEffect } from "react"
import "./Binary3.css" // Ensure this is the correct CSS file

function Binary3({ onNext, timer, TimerDisplay }) {
  const [numberInput, setNumberInput] = useState("")
  const [result, setResult] = useState({ show: false, isCorrect: false })
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTime, setBlockTime] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State for hamburger menu

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen) // Function to toggle menu

  useEffect(() => {
    let timerId
    if (isBlocked && blockTime > 0) {
      timerId = setTimeout(() => setBlockTime(blockTime - 1), 1000)
    } else if (blockTime === 0 && isBlocked) {
      setIsBlocked(false)
      setNumberInput("")
    }
    return () => clearTimeout(timerId)
  }, [isBlocked, blockTime])

  const checkAnswer = () => {
    if (isBlocked || timer === 0) return

    if (numberInput.trim() === "2") {
      setResult({ show: true, isCorrect: true })
      setAttempts(0)
    } else {
      setResult({ show: true, isCorrect: false })
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (newAttempts >= 3) {
        const penalty = 10 + 5 * (newAttempts - 3)
        setIsBlocked(true)
        setBlockTime(penalty)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isBlocked && numberInput.trim() !== "" && timer > 0) {
      checkAnswer()
    }
  }

  return (
    <div className="binary-workshop">
      {TimerDisplay}

      {/* --- Standardized Hamburger Menu from HomePage --- */}
      <div
        className={`nav-toggle ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        role="button"
        tabIndex={0}
        aria-label="Toggle menu"
      >
        <div className="toggle-bar"></div>
        <div className="toggle-bar"></div>
        <div className="toggle-bar"></div>
      </div>

      <div className={`info-panel ${isMenuOpen ? "show" : ""}`}>
        <h3 className="panel-header">💡 Puzzle Info</h3>
        <div className="info-item">
          <strong>Tip:</strong> Apply the 8-4-2-1 rule to determine the value of a 4-bit binary number. For example, `0100` is 4.
        </div>
      </div>

      <div className="conversion-station">
        <h2>What is the Hexadecimal value of:</h2>
        <p>
          <code className="binary-sequence">0010</code>
        </p>
        <div className="conversion-controls">
          <input
            type="number"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isBlocked ? `Blocked (${blockTime}s)` : "Enter your answer here"}
            className="binary-decoder"
            disabled={isBlocked || timer === 0 || result.isCorrect}
          />
        </div>
        <div className="control-panel">
          <button
            onClick={checkAnswer}
            disabled={isBlocked || numberInput.length === 0 || timer === 0 || result.isCorrect}
            className={`decode-submit ${isBlocked || numberInput.length === 0 || result.isCorrect ? "disabled" : ""}`}
          >
            {isBlocked ? `⏳ ${blockTime}s` : "Submit"}
          </button>
        </div>
        {result.show && (
          <div className={`status-indicator ${result.isCorrect ? "success-indicator" : "error-indicator"}`}>
            {result.isCorrect ? "✅ Correct!" : "❌ Incorrect"}
          </div>
        )}

        <button onClick={onNext} disabled={!result.isCorrect || timer === 0} className="workshop-next">
          Go to Next Clue ➡️
        </button>

        <section className="attempts-section">
          <div className="attempts-tracker">
            <span className="attempts-label">Attempts:</span>
            <div className="attempts-dots" role="img" aria-label={`${attempts} out of 3 attempts used`}>
              {[1, 2, 3].map((attempt) => (
                <div key={attempt} className={`attempts-dot ${attempts >= attempt ? "used" : ""}`} aria-hidden="true" />
              ))}
            </div>
          </div>
        </section>

        {timer === 0 && <p style={{ color: "#e55", fontWeight: "bold" }}>⏰ Time's up!</p>}
      </div>
    </div>
  )
}

export default Binary3;