        export default function DailyKickoff({ onUnlock }) {
  return (
    <div className="quiz-modal">
      <h2>Daily Safety Quiz</h2>
      <p>Quiz coming soon — tap below to continue.</p>
      <button onClick={onUnlock}>
        Enter App ▶
      </button>
    </div>
  );
}
