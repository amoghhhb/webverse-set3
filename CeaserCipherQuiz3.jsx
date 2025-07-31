"use client"

import { useState, useEffect } from "react"
import "./CeaserCipherQuiz3.css"

export default function CaesarCipherQuiz3({ onNext, timer, TimerDisplay }) {
  const [userAnswer, setUserAnswer] = useState("")
  const [resultMsg, setResultMsg] = useState("")
  const [resultColor, setResultColor] = useState("#fff")
  const [nextEnabled, setNextEnabled] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTime, setBlockTime] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const correctAnswer = "two" 

  useEffect(() => {
    let timerId
    if (isBlocked && blockTime > 0) {
      timerId = setTimeout(() => setBlockTime(blockTime - 1), 1000)
    } else if (blockTime === 0 && isBlocked) {
      setIsBlocked(false)
      setUserAnswer("")
    }
    return () => clearTimeout(timerId)
  }, [isBlocked, blockTime])

  const checkAnswer = () => {
    if (isBlocked || timer === 0) return
    if (userAnswer.trim().toLowerCase() === correctAnswer) {
      setResultMsg("✅ Correct! Well done!")
      setResultColor("#00ff00")
      setNextEnabled(true)
      setAttempts(0)
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (newAttempts >= 3) {
        const penalty = 10 + 5 * (newAttempts - 3)
        setIsBlocked(true)
        setBlockTime(penalty)
        setResultMsg(`❌ Blocked for ${penalty} seconds. Try again later!`)
      } else {
        setResultMsg(`❌ Incorrect. Attempts left: ${3 - newAttempts}`)
      }
      setResultColor("#ff6b6b")
      setNextEnabled(false)
    }
  }

  return (
    <div className="cipher-studio">
      {TimerDisplay}
      
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
          <strong>Cipher Type:</strong> Caesar Cipher is a simple substitution cipher.
        </div>
        <div className="info-item">
          <strong>Shift:</strong> A shift of -3 means each letter is replaced by the letter 3 positions *before* it in the alphabet.
        </div>
      </div>

      <div className="decryption-workspace">
        <h2 className="studio-title">🔐 Caesar Cipher Decryption Quiz</h2>
        <div className="coded-transmission">
          <p>
            <strong>Encrypted Message:</strong>
            <br />
            <code className="cipher-text">WZR</code> 
          </p>
          <p className="shift-indicator">Shift: -3</p> 
        </div>
        
        <div className="input-submit-group">
          <input
            type="text"
            placeholder={isBlocked ? `Blocked (${blockTime}s)` : "Enter your decrypted answer here"}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={isBlocked || timer === 0}
            className="decode-field"
          />
          <button
            onClick={checkAnswer}
            disabled={isBlocked || userAnswer.trim() === "" || timer === 0}
            className={`decode-btn ${isBlocked || userAnswer.trim() === "" ? "disabled" : ""}`}
          >
            {isBlocked ? `⏳ ${blockTime}s` : "Submit"}
          </button>
        </div>

        {resultMsg && (
          <div className={`status-indicator ${resultColor === "#ff6b6b" ? "error-indicator" : "success-indicator"}`}>
            {resultMsg}
          </div>
        )}

        <button
          onClick={onNext}
          disabled={!nextEnabled || timer === 0}
          className={`continue-btn ${!nextEnabled ? "disabled" : ""}`}
        >
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

        {timer === 0 && <div className="timeout-message">⏰ Time's up!</div>}
      </div>
    </div>
  )
}