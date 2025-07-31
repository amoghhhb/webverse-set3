"use client"

import { useState, useEffect } from "react"
import "./GamePage3.css"

function GamePage3({ onNext, timer, TimerDisplay }) {
  const [answer, setAnswer] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [tries, setTries] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimer, setBlockTimer] = useState(10)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State for hamburger menu

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen) // Function to toggle menu

  useEffect(() => {
    let timerId
    if (isBlocked) {
      if (blockTimer > 0) {
        timerId = setTimeout(() => setBlockTimer(blockTimer - 1), 1000)
      } else {
        setIsBlocked(false)
        setTries(0)
        setBlockTimer(10)
        setErrorMessage("")
      }
    }
    return () => clearTimeout(timerId)
  }, [isBlocked, blockTimer])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isBlocked || timer === 0) return

    if (answer === "1") {
      setIsCorrect(true)
      setErrorMessage("")
    } else {
      setIsCorrect(false)
      const newTries = tries + 1
      setTries(newTries)
      if (newTries >= 3) {
        setIsBlocked(true)
        setErrorMessage("Too many tries! Please wait 10 seconds ⏳")
      } else {
        setErrorMessage("Incorrect clue input ❌")
      }
    }
  }

  const handleSimulatorClick = () => {
    window.open("https://circuitverse.org/simulator", "_blank", "noopener,noreferrer")
  }

  return (
    <div className="logic-gate-arena">
      <div className="logic-timer-display">{TimerDisplay}</div>

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
          <strong>Instructions:</strong> Solve the logic gate puzzle by determining the final output.
        </div>
        <div className="info-item">
          <strong>Tip:</strong> Use the Circuit Simulator if you need help visualizing the logic.
        </div>
      </div>

      <div className="logic-challenge-panel">
        <header className="logic-challenge-header">
          <h1 className="logic-main-title">Logic Gate Puzzle</h1>
        </header>

        <section className="logic-problem-area">
          <div className="logic-problem-workspace">
            <h2 className="logic-workspace-title">
              <span className="logic-workspace-icon" role="img" aria-label="lightning">
                ⚡
              </span>
              <span>Solve the Logic Expression</span>
            </h2>
            <div className="logic-formula-display">
              <code className="logic-expression-text" aria-label="Logic expression: A OR B">
                A OR B
              </code>
            </div>
            <div className="logic-variables-area">
              <h3 className="logic-variables-title">Given Values:</h3>
              <div className="logic-variables-container" role="list" aria-label="Variable values">
                <div className="logic-variable-item" role="listitem">
                  <span className="logic-variable-name">A =</span>
                  <span className="logic-variable-value" aria-label="A equals 1">
                    1
                  </span>
                </div>
                <div className="logic-variable-item" role="listitem">
                  <span className="logic-variable-name">B =</span>
                  <span className="logic-variable-value" aria-label="B equals 0">
                    0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="logic-response-area">
          <form onSubmit={handleSubmit} className="logic-response-form">
            <div className="logic-response-group">
              <label htmlFor="answer" className="logic-response-label">
                Your Answer
              </label>
              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="logic-answer-input"
                disabled={isBlocked || timer === 0 || isCorrect}
                placeholder=""
                maxLength={1}
                pattern="[01]"
                inputMode="numeric"
                aria-describedby="answer-help"
                autoComplete="off"
              />
              <div id="answer-help" className="logic-sr-only">
              </div>
            </div>

            <button
              type="button"
              className="logic-tool-button"
              onClick={handleSimulatorClick}
              aria-label="Open CircuitVerse simulator in new tab"
            >
              <span className="tool-icon" role="img" aria-hidden="true">
                🔧
              </span>
              <span>Circuit Simulator</span>
            </button>
          </form>
        </section>

        <section className="logic-button-section">
          <div className="logic-button-container">
            <button
              type="button"
              className="logic-solve-button"
              onClick={handleSubmit}
              disabled={isBlocked || timer === 0 || isCorrect || !answer.trim()}
              aria-describedby="submit-status"
            >
              {isBlocked ? `Wait ${blockTimer}s` : "Submit"}
            </button>

            <button
              className={`logic-navigate-button ${!isCorrect || timer === 0 ? "disabled" : ""}`}
              onClick={onNext}
              disabled={!isCorrect || timer === 0}
              aria-describedby="next-help"
            >
              <span className="navigate-text">Go to Next Clue</span>
              <span className="navigate-icon" aria-hidden="true">
                ➡️
              </span>
            </button>
          </div>
          <div id="next-help" className="logic-sr-only">
          </div>
        </section>

        <section className="logic-status-area" aria-live="polite" aria-atomic="true">
          {errorMessage && (
            <div className="logic-status-message logic-error-message" role="alert">
              <span className="logic-status-icon" aria-hidden="true">
                ❌
              </span>
              <span className="alert-text">
                {errorMessage} {isBlocked && ` (${blockTimer}s)`}
              </span>
            </div>
          )}

          {isCorrect && (
            <div className="logic-status-message logic-success-message" role="alert">
              <span className="logic-status-icon" aria-hidden="true">
                ✅
              </span>
              <span className="alert-text">Correct! Click next to continue.</span>
            </div>
          )}

          {timer === 0 && (
            <div className="logic-status-message logic-timeout-message" role="alert">
              <span className="logic-status-icon" aria-hidden="true">
                ⏰
              </span>
              <span className="alert-text">{"Time's up!"}</span>
            </div>
          )}
        </section>

        <section className="logic-progress-area">
          <div className="logic-progress-display">
            <span className="logic-progress-label">Attempts:</span>
            <div className="logic-progress-indicators" role="img" aria-label={`${tries} out of 3 attempts used`}>
              {[1, 2, 3].map((attempt) => (
                <div
                  key={attempt}
                  className={`logic-progress-dot ${tries >= attempt ? "used" : ""}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default GamePage3