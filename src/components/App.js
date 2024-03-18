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
import { useQuizContext } from "../context/QuizContext";

function App() {
  const { status } = useQuizContext();

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {(status === "active" || status === "verify") && (
          <>
            <Progress />
            <Question />
            <Footer>
              {status === "verify" && <PreviousButton />}

              <NextButton />

              {status !== "verify" && <Timer />}
            </Footer>
          </>
        )}
        {status === "finished" && <FinishScreen />}
      </Main>
    </div>
  );
}

export default App;
