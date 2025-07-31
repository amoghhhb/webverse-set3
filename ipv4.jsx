"use client"

import { useState, useEffect } from "react"
import "./ipv4.css" // Changed CSS file import

const IPv4 = ({ timer, TimerDisplay, onNext }) => {
  const [answer, setAnswer] = useState("")
  const [result, setResult] = useState("")
  const [showNextButton, setShowNextButton] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false) // Added for blocking logic
  const [blockTime, setBlockTime] = useState(0) // Added for blocking logic

  // Helper function to format the time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
  };

  // Effect for handling the block timer
  useEffect(() => {
    let timerId
    if (isBlocked && blockTime > 0) {
      timerId = setTimeout(() => setBlockTime((prev) => prev - 1), 1000)
    } else if (blockTime === 0 && isBlocked) {
      setIsBlocked(false)
      // Optionally reset answer here after unblock
      setAnswer("")
      setResult("You can try again now.") // Message after unblock
    }
    return () => clearTimeout(timerId)
  }, [isBlocked, blockTime])

  const checkAnswer = (e) => {
    // Prevent form submission and scrolling
    if (e) {
      e.preventDefault()
    }

    if (timer === 0 || isBlocked) return // Prevent interaction if timer is 0 or blocked

    if (answer.trim() === "5") {
      setResult("✅ Correct! Classes A, B, C, D, and E.") // Updated success message
      setIsCorrect(true)
      setShowNextButton(true)
      setAttempts(0) // Reset attempts on success
      setIsBlocked(false) // Ensure unblocked if they somehow got here while blocked
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (newAttempts >= 3) {
        const penalty = 10 // 10-second penalty
        setIsBlocked(true)
        setBlockTime(penalty)
        setResult(`❌ Incorrect! Too many tries. Blocked for ${penalty} seconds.`)
      } else {
        setResult("❌ Incorrect! Try again.")
      }
      setIsCorrect(false)
      setShowNextButton(false)
    }
  }

  return (
    <div className="ipv4-networking-arena">
      {/* This is the new, unified timer component */}
      <div className="unified-timer">
        <span className="icon">⌛</span>
        <span>{formatTime(timer)}</span>
      </div>

      <div className="ipv4-challenge-panel">
        <h1 className="ipv4-main-title">🌐 IPv4 Address Classes Quiz</h1>
        <div className="ipv4-challenge-prompt">How many classes of IPv4 addresses are commonly known?</div>
        <form onSubmit={checkAnswer} style={{ display: "contents" }}>
          <input
            type="number"
            className="ipv4-answer-field"
            placeholder={isBlocked ? `Blocked (${blockTime}s)` : "?"} // Show block timer in placeholder
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={timer === 0 || isCorrect || isBlocked} // Disable if blocked
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                checkAnswer()
              }
            }}
          />
          <div
            className={`ipv4-status-message ${isCorrect ? "ipv4-success-message" : result ? "ipv4-error-message" : ""}`}
          >
            {result}
          </div>
          <section className="ipv4-attempts-area">
            <div className="ipv4-attempts-display">
              <span className="ipv4-attempts-label">Attempts:</span>
              <div className="ipv4-attempts-indicators" role="img" aria-label={`${attempts} out of 3 attempts used`}>
                {[1, 2, 3].map((attempt) => (
                  <div
                    key={attempt}
                    className={`ipv4-attempt-dot ${attempts >= attempt ? "used" : ""}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          </section>
          <button
            type="button"
            className="ipv4-submit-button"
            onClick={(e) => {
              e.preventDefault()
              checkAnswer()
            }}
            disabled={answer.trim() === "" || timer === 0 || isCorrect || isBlocked} // Disable if blocked
          >
            {isBlocked ? `⏳ ${blockTime}s` : "Submit"} {/* Show block timer on button */}
          </button>
        </form>
        {showNextButton && (
          <button className="ipv4-next-button advance-btn" onClick={onNext}>
            Click to Continue
          </button>
        )}
        {!isCorrect && (
          <div className="ipv4-challenge-hint">🧐 Hint: Think about how IP addresses are categorized.</div>
        )}
        {timer === 0 && <p style={{ color: "#e55", fontWeight: "bold" }}>⏰ Time's up!</p>}
      </div>
    </div>
  )
}

export default IPv4