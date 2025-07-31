"use client"

import { useState, useRef, useEffect } from "react"
import "./EmojiRiddle3.css"

export default function EmojiRiddle3({ onNext, timer, TimerDisplay }) {
  const [answer1, setAnswer1] = useState("")
  const [answer2, setAnswer2] = useState("")
  const [resultMsg, setResultMsg] = useState("Total: 0")
  const [resultColor, setResultColor] = useState("#fff")
  const [isNextDisabled, setIsNextDisabled] = useState(true)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeLeft, setBlockTimeLeft] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const submitBtnRef = useRef(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  useEffect(() => {
    let timerId = null
    if (isBlocked && blockTimeLeft > 0) {
      timerId = setTimeout(() => setBlockTimeLeft((prev) => prev - 1), 1000)
    } else if (isBlocked && blockTimeLeft === 0) {
      setIsBlocked(false)
      setResultMsg("⏱️ You can try again now.")
      setResultColor("#fff")
    }
    return () => clearTimeout(timerId)
  }, [isBlocked, blockTimeLeft])

  const updateResult = () => {
    if (isBlocked || timer === 0) return

    const trimmedAnswer1 = answer1.trim().toLowerCase()
    const trimmedAnswer2 = answer2.trim().toLowerCase()

    if (trimmedAnswer1 === "spot" && trimmedAnswer2 === "bugs") {
      setResultMsg("✅ Correct! Total: 8")
      setResultColor("#00ff00")
      setIsNextDisabled(false)
      setWrongAttempts(0)
      setIsCorrect(true)
    } else {
      const newAttempts = wrongAttempts + 1
      setWrongAttempts(newAttempts)
      const totalLength = trimmedAnswer1.length + trimmedAnswer2.length;
      setResultMsg(`❌ Incorrect. Total: ${totalLength}`)
      setResultColor("#ff3333")
      setIsNextDisabled(true)

      if (newAttempts >= 3) {
        const blockDuration = 10 + 5 * (newAttempts - 3)
        setIsBlocked(true)
        setBlockTimeLeft(blockDuration)
        setResultMsg(`⏳ Too many wrong attempts. Try again in ${blockDuration} second${blockDuration > 1 ? "s" : ""}.`)
        setResultColor("#ff0000ff")
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      updateResult()
      if (submitBtnRef.current) {
        submitBtnRef.current.focus()
      }
    }
  }

  return (
    <div className="emoji-puzzle-arena">
      <div className="emoji-timer-widget">{TimerDisplay}</div>
      
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
          <strong>Instructions:</strong> Decode the sequence of emojis into words.
        </div>
        <div className="info-item">
          <strong>Tip:</strong> Think about what each emoji represents, either literally or phonetically.
        </div>
      </div>

      <div className="emoji-puzzle-panel">
        <header className="emoji-puzzle-header">
          <h1 className="emoji-main-title">Emoji Riddle Puzzle</h1>
          <div className="emoji-challenge-badge">
          </div>
        </header>

        <section className="emoji-riddle-section">
          <div className="emoji-riddle-workspace">
            <h2 className="emoji-workspace-title">
              <span className="emoji-workspace-icon" role="img" aria-label="lightbulb">
                💡
              </span>
              <span>Decode the Emoji Sequence</span>
            </h2>
            <div className="emoji-sequence-display">
              <div className="emoji-sequence-text" aria-label="Emoji sequence: magnifying glass, two ladybugs">
                🔎+🐞🐞
              </div>
            </div>
          </div>
        </section>

        <section className="emoji-answer-section">
          <div className="emoji-input-container multiple-inputs">
            {" "}
            <div className="emoji-input-group">
              <input
                type="text"
                maxLength={10}
                value={answer1}
                onChange={(e) => setAnswer1(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isBlocked || timer === 0 || isCorrect}
                className="emoji-answer-field"
                placeholder="First Word"
                aria-label="First word of your answer"
              />
              <div className="emoji-character-counter">{answer1.trim().length} letters</div>
            </div>
            <div className="emoji-input-group">
              <input
                type="text"
                maxLength={10}
                value={answer2}
                onChange={(e) => setAnswer2(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isBlocked || timer === 0 || isCorrect}
                className="emoji-answer-field"
                placeholder="Second Word"
                aria-label="Second word of your answer"
              />
              <div className="emoji-character-counter">{answer2.trim().length} letters</div>
            </div>
          </div>

          <div className="emoji-action-buttons">
            <div className="emoji-form-container">
              <button
                ref={submitBtnRef}
                onClick={updateResult}
                disabled={isBlocked || timer === 0 || isCorrect || !answer1.trim() || !answer2.trim()}
                className="emoji-submit-button"
                type="button"
              >
                {isBlocked ? `Wait ${blockTimeLeft}s` : isCorrect ? "Submitted" : "Submit"}
              </button>
            </div>

            <div className="emoji-navigation-area">
              <button
                className={`emoji-next-button ${isNextDisabled || timer === 0 ? "disabled" : ""}`}
                onClick={onNext}
                disabled={isNextDisabled || timer === 0}
                aria-describedby="next-help"
              >
                <span className="advance-text">Go to Next Clue</span>
                <span className="emoji-next-arrow" aria-hidden="true">
                  ➡️
                </span>
              </button>
              <div id="next-help" className="emoji-sr-only">
              </div>
            </div>
          </div>
        </section>

        <section className="emoji-result-area" aria-live="polite" aria-atomic="true">
          <div
            className={`emoji-status-message ${resultColor === "#00ff00" ? "emoji-success-message" : resultColor === "#ff3333" || resultColor === "#ff0000ff" ? "emoji-error-message" : ""}`}
            role="alert"
          >
            <span className="result-text">{resultMsg}</span>
          </div>

          {timer === 0 && (
            <div className="emoji-status-message emoji-error-message" role="alert">
              <span className="timeout-icon" aria-hidden="true">
                ⏰
              </span>
              <span className="timeout-text">{"Time's up!"}</span>
            </div>
          )}
        </section>

        <section className="emoji-attempts-area">
          <div className="emoji-attempts-display">
            <span className="emoji-attempts-label">Attempts:</span>
            <div
              className="emoji-attempts-indicators"
              role="img"
              aria-label={`${wrongAttempts} out of 3 attempts used`}
            >
              {[1, 2, 3].map((attempt) => (
                <div
                  key={attempt}
                  className={`emoji-attempt-dot ${wrongAttempts >= attempt ? "used" : ""}`}
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