"use client"

import { useState, useEffect } from "react"
import "./InspectPage3.css"

function InspectPage3({ onNext, timer, TimerDisplay }) {
  const [answer, setAnswer] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [error, setError] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State for hamburger menu

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen) // Function to toggle menu

  const handleInputChange = (e) => {
    const val = e.target.value
    if (/^[0-9]*$/.test(val)) {
      setAnswer(val)
      setError("")
      setSuccessMsg("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isBlocked || answer === "" || timer === 0) return

    if (answer === "0") {
      setIsVerified(true)
      setError("")
      setSuccessMsg("✅ Access granted! Clue accepted.")
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setSuccessMsg("")

      if (newAttempts >= 3) {
        const penalty = 10 + 5 * (newAttempts - 3)
        setIsBlocked(true)
        setTimeLeft(penalty)
        setError(`❌ Locked for ${penalty} seconds`)
      } else {
        setError(`❌ Incorrect. ${3 - newAttempts} attempt${3 - newAttempts === 1 ? "" : "s"} left.`)
      }
    }
  }

  useEffect(() => {
    let timerId
    if (isBlocked && timeLeft > 0) {
      timerId = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    } else if (isBlocked && timeLeft === 0) {
      setIsBlocked(false)
      setAnswer("")
      setError("")
      setSuccessMsg("")
    }
    return () => clearTimeout(timerId)
  }, [isBlocked, timeLeft])

  const getContainerClass = () => {
    if (isVerified) return "inspect-investigation-panel success-container"
    if (error) return "inspect-investigation-panel error-container"
    return "inspect-investigation-panel"
  }

  return (
    <div className="inspect-detective-arena">
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
          <strong>Tip:</strong> The clue is hidden somewhere on this page, but not in plain sight. You might need your browser's developer tools to find it!
        </div>
      </div>
      
      <div className={getContainerClass()}>
        <h1 className="inspect-mystery-title">INSPECT TILL YOU SUSPECT 🕵️</h1>
        <p className="inspect-riddle-text">Discover the hidden verification code:</p>
        <form onSubmit={handleSubmit} className="inspect-verification-form">
          <div className="inspect-code-input-section">
            <input
              type="number"
              value={answer}
              onChange={handleInputChange}
              disabled={isBlocked || isVerified || timer === 0}
              placeholder="Enter The Discovered Code"
              className="inspect-secret-code-field"
            />
            <button
              type="submit"
              disabled={isBlocked || answer === "" || isVerified || timer === 0}
              className="inspect-verify-button"
            >
              {isBlocked ? `⏳ ${timeLeft}s` : "Verify"}
            </button>
          </div>
          {error && <div className="inspect-status-message inspect-error-message">{error}</div>}
          {successMsg && <div className="inspect-status-message inspect-success-message">{successMsg}</div>}
          <section className="inspect-attempts-area">
            <div className="inspect-attempts-display">
              <span className="inspect-attempts-label">Attempts:</span>
              <div className="inspect-attempts-indicators" role="img" aria-label={`${attempts} out of 3 attempts used`}>
                {[1, 2, 3].map((attempt) => (
                  <div
                    key={attempt}
                    className={`inspect-attempt-dot ${attempts >= attempt ? "used" : ""}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          </section>
        </form>
        <p
          style={{
            color: "#222",
            fontSize: "12px",
            opacity: 0.23,
            marginTop: "18px",
            userSelect: "none",
            display: "none", // This keeps it hidden
          }}
        >
          Clue is 1075.2*0
        </p>
        <button className="inspect-proceed-button" onClick={onNext} disabled={!isVerified || timer === 0}>
          Go to Next Clue ➡️
        </button>
        {timer === 0 && <p style={{ color: "#e55", fontWeight: "bold" }}>⏰ Time's up!</p>}
      </div>
    </div>
  )
}

export default InspectPage3