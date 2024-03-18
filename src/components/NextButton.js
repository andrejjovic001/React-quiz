import { useQuizContext } from "../context/QuizContext";

function NextButton() {
  const { dispatch, answer, index, numQuestions } = useQuizContext();

  // Ovo smo mogli uraditi i u App komponenti, {answer !== null && <NextButton dispatch={dispatch} />}
  if (answer === null) return null;

  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );

  if (index === numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish
      </button>
    );
}

export default NextButton;
