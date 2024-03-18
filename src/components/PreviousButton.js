import { useQuizContext } from "../context/QuizContext";

function PreviousButton() {
  const { dispatch, index } = useQuizContext();

  if (index === 0) return <span></span>;

  return (
    <button
      className="btn prev-btn"
      onClick={() => dispatch({ type: "prevQuestion" })}
    >
      Prev
    </button>
  );
}

export default PreviousButton;
