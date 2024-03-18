function PreviousButton({ dispatch, index }) {
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
