"use client"

import { useState, useRef, useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"
import HomePage from "./HomePage"
import GamePage3 from "./GamePage3" // Corrected import
import EmojiRiddle3 from "./EmojiRiddle3"
import InspectPage3 from "./InspectPage3"
import CeaserCipherQuiz3 from "./CeaserCipherQuiz3"
import Binary3 from "./Binary3"
import IPv4 from "./ipv4"
import SecureAccess from "./SecureAccess"
import Leaderboard from "./Leaderboard"

function ErrorFallback({ error }) {
  return (
    <div role="alert" style={{ color: "red", padding: "20px", background: "#fff" }}>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={() => window.location.reload()}>Refresh</button>
    </div>
  )
}

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0")
  const sec = String(seconds % 60).padStart(2, "0")
  return `${min}:${sec}`
}

function TimerDisplay({ seconds }) {
  return (
    <div
      style={{
        position: "fixed",
        left: 25,
        top: 10,
        zIndex: 2000,
        fontFamily: "'Orbitron', 'Oswald', 'Arial Black', Arial, sans-serif",
        fontWeight: 900,
        fontSize: "1.6rem",
        color: "#fff",
        letterSpacing: "2px",
        textShadow: `0 0 2px #fff, 0 0 4px #fff`,
      }}
    >
      ⏳ {formatTime(seconds)}
    </div>
  )
}

const PAGE_ORDER = [
  "home",
  "GamePage3",
  "EmojiRiddle3",
  "CeaserCipherQuiz3",
  "InspectPage3",
  "Binary3",
  "ipv4",
  "SecureAccess",
  "Leaderboard",
]

function App() {
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState("home")
  const [timer, setTimer] = useState(600)
  const [timerActive, setTimerActive] = useState(false)
  const [timeTaken, setTimeTaken] = useState(0)
  const [userData, setUserData] = useState({ name: "", department: "" })
  const timerRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
    const loadAssets = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(loadAssets)
  }, [])

  const showTimer =
    PAGE_ORDER.indexOf(page) >= PAGE_ORDER.indexOf("GamePage3") &&
    PAGE_ORDER.indexOf(page) <= PAGE_ORDER.indexOf("SecureAccess")

  useEffect(() => {
    if (timerActive && showTimer && timer > 0) {
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [timerActive, showTimer])

  useEffect(() => {
    if (timer === 0 && timerActive) setTimerActive(false)
  }, [timer, timerActive])

  const handleStartGame = (user) => {
    setUserData(user)
    setTimer(600)
    setTimerActive(true)
    setPage("GamePage3")
  }

  const handleCompleteSecureAccess = () => {
    setTimeTaken(600 - timer)
    setTimerActive(false)
    setPage("Leaderboard")
  }

  if (!isClient || isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#000",
        }}
      >
        <h1 style={{ color: "#fff" }}>Loading WebVerse...</h1>
      </div>
    )
  }

  const sharedProps = {
    timer,
    TimerDisplay: showTimer ? <TimerDisplay seconds={timer} /> : null,
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {(() => {
        switch (page) {
          case "home":
            return <HomePage onNext={handleStartGame} />
          case "GamePage3":
            return <GamePage3 {...sharedProps} onNext={() => setPage("EmojiRiddle3")} />
          case "EmojiRiddle3":
            return <EmojiRiddle3 {...sharedProps} onNext={() => setPage("CeaserCipherQuiz3")} />
          case "CeaserCipherQuiz3":
            return <CeaserCipherQuiz3 {...sharedProps} onNext={() => setPage("InspectPage3")} />
          case "InspectPage3":
            return <InspectPage3 {...sharedProps} onNext={() => setPage("Binary3")} />
          case "Binary3":
            return <Binary3 {...sharedProps} onNext={() => setPage("ipv4")} />
          case "ipv4":
            return <IPv4 {...sharedProps} onNext={() => setPage("SecureAccess")} />
          case "SecureAccess":
            return <SecureAccess {...sharedProps} onNext={handleCompleteSecureAccess} />
          case "Leaderboard":
            return <Leaderboard timeTaken={timeTaken} userData={userData} />
          default:
            return <div style={{ color: "#fff", padding: "20px" }}>404 Not Found</div>
        }
      })()}
    </ErrorBoundary>
  )
}

export default App
