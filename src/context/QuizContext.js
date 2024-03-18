import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContextContext = createContext();

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  filterQuestions: [],
  questionValue: 15,

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: JSON.parse(localStorage.getItem("highscore")) ?? 0,
  secondRemaining: null,
  answers: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
        filterQuestions: action.payload,
      };

    case "dataFailed":
      return { ...state, status: "error" };

    case "start":
      return {
        ...state,
        status: "active",
        secondRemaining: state.filterQuestions.length * SECS_PER_QUESTION,
      };

    case "setNumber":
      return {
        ...state,
        questionValue: action.payload,
        filterQuestions: state.questions.slice(0, action.payload),
      };

    case "newAnswer":
      const question = state.filterQuestions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
        answers: [...state.answers, action.payload],
      };

    case "nextQuestion":
      const iterator =
        state.index + 1 < state.filterQuestions.length
          ? state.index + 1
          : state.index;

      return {
        ...state,
        index: state.index + 1,
        answer: state.answers.at(iterator) ? state.answers.at(iterator) : null,
      };

    case "finish":
      const newHighscore =
        state.points >= state.highscore ? state.points : state.highscore;

      localStorage.setItem("highscore", JSON.stringify(newHighscore));

      return {
        ...state,
        status: "finished",
        index: 0,
        highscore: newHighscore,
      };

    case "seeAnswers":
      return { ...state, answer: state.answers[state.index], status: "verify" };

    case "prevQuestion":
      const i = state.index - 1 >= 0 ? state.index - 1 : state.index;

      return {
        ...state,
        index: i,
        answer: state.answers.at(i) ? state.answers.at(i) : null,
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        highscore: state.highscore,
        status: "ready",
      };

    case "tick":
      return {
        ...state,
        secondRemaining: state.secondRemaining - 1,
        status: state.secondRemaining === 0 ? "finished" : state.status,
        highscore:
          state.secondRemaining === 0
            ? Math.max(state.points, state.highscore)
            : state.highscore,
      };

    default:
      throw new Error("Action uknknown");
  }
}

function QuizContextProvider({ children }) {
  const [
    {
      status,
      index,
      answer,
      points,
      highscore,
      secondRemaining,
      questionValue,
      filterQuestions,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = filterQuestions.length;

  const maxPossiblePoints = filterQuestions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  const question = filterQuestions[index];

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <QuizContextContext.Provider
      value={{
        filterQuestions,
        questionValue,
        question,
        status,
        index,
        answer,
        points,
        highscore,
        secondRemaining,
        numQuestions,
        maxPossiblePoints,

        dispatch,
      }}
    >
      {children}
    </QuizContextContext.Provider>
  );
}

function useQuizContext() {
  const context = useContext(QuizContextContext);
  if (context === undefined) {
    throw new Error("QuizContextContext was used outside QuizContextProvider");
  }
  return context;
}

export { QuizContextProvider, useQuizContext };
