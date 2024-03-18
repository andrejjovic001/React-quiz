import { useQuizContext } from "../context/QuizContext";
import Options from "./Options";

function Question() {
  const { question, dispatch, answer, status } = useQuizContext();

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
