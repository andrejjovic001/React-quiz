import Options from "./Options";

function Question({ question, dispatch, answer, status }) {
  return (
    <div>
      {status === "verify" && (
        <button
          className="back-btn"
          onClick={() => dispatch({ type: "finish" })}
        >
          ⏩
        </button>
      )}
      <h4>{question.question}</h4>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}

export default Question;
