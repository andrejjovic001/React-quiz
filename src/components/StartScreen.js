import { useQuizContext } from "../context/QuizContext";

function StartScreen() {
  const { numQuestions, questionValue, dispatch, highscore } = useQuizContext();

  return (
    <div className="start">
      <span className="span-highscore">Highscore: {highscore}</span>
      <h2>Welcome to The React Quiz!</h2>

      <div>
        <div className="form">
          <label>Enter the question number (between 4 and 15)</label>
          <input
            type="text"
            placeholder="Enter number..."
            value={questionValue}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value <= 15) {
                dispatch({ type: "setNumber", payload: value });
              }
            }}
          />
        </div>
      </div>
      <h3>{numQuestions} question to test your React mastery</h3>

      {numQuestions > 3 && (
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "start" })}
        >
          Let's start
        </button>
      )}
    </div>
  );
}

export default StartScreen;
