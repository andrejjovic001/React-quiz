import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import PreviousButton from "./PreviousButton";

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

function App() {
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

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            questionValue={questionValue}
            dispatch={dispatch}
            highscore={highscore}
          />
        )}
        {(status === "active" || status === "verify") && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={filterQuestions[index]}
              dispatch={dispatch}
              answer={answer}
              status={status}
            />
            <Footer>
              {status === "verify" && (
                <PreviousButton dispatch={dispatch} index={index} />
              )}

              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />

              {status !== "verify" && (
                <Timer dispatch={dispatch} secondRemaining={secondRemaining} />
              )}
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
