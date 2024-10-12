import { useEffect, useState } from "react";
import axios from "axios"; // Axios fetch questions from API
import Question from "./Question";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timer, setTimer] = useState(10);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const username = localStorage.getItem("currentUser") || "";

  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      const savedProgress = localStorage.getItem(`quizProgress_${username}`);
      if (savedProgress) {
        const {
          savedQuestions,
          savedCurrentQuestionIndex,
          savedCorrectAnswers,
          savedTimer,
          savedQuizFinished,
          savedAnsweredQuestions,
        } = JSON.parse(savedProgress);

        setQuestions(savedQuestions);
        setCurrentQuestionIndex(savedCurrentQuestionIndex);
        setCorrectAnswers(savedCorrectAnswers);
        setTimer(savedTimer);
        setQuizFinished(savedQuizFinished);
        setAnsweredQuestions(savedAnsweredQuestions);
        setQuizStarted(true);
      }
    }
  }, [username]);

  useEffect(() => {
    if (quizStarted && username) {
      const quizProgress = {
        savedQuestions: questions,
        savedCurrentQuestionIndex: currentQuestionIndex,
        savedCorrectAnswers: correctAnswers,
        savedTimer: timer,
        savedQuizFinished: quizFinished,
        savedAnsweredQuestions: answeredQuestions,
      };
      localStorage.setItem(
        `quizProgress_${username}`,
        JSON.stringify(quizProgress)
      );
    }
  }, [
    currentQuestionIndex,
    correctAnswers,
    timer,
    quizFinished,
    quizStarted,
    username,
    answeredQuestions,
  ]);

  useEffect(() => {
    if (questions.length === 0) {
      axios
        .get(
          "https://opentdb.com/api.php?amount=10&category=30&difficulty=easy&type=multiple"
        )
        .then((response) => {
          setQuestions(response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
        });
    }
  }, [questions]);

  useEffect(() => {
    if (quizFinished || !quizStarted) return;

    if (timer === 0) {
      setQuizFinished(true);
    }

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, quizFinished, quizStarted]);

  const handleStart = () => {
    setQuizStarted(true);
  };

  const handleRetry = () => {
    localStorage.removeItem(`quizProgress_${username}`);
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setAnsweredQuestions(0);
    setTimer(10);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem(`quizProgress_${username}`);
    navigate("/");
  };

  const handleNext = (isCorrect) => {
    if (isCorrect) setCorrectAnswers(correctAnswers + 1);
    setAnsweredQuestions(answeredQuestions + 1);
    setTimer(10);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const scorePercentage = ((correctAnswers / questions.length) * 100).toFixed(
    2
  );

  return (
    <div>
      {!quizStarted ? (
        <div className="start-screen">
          <h2>Welcome to the Quiz!</h2>
          <button className="start-btn" onClick={handleStart}>
            Start Quiz
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <>
          {!quizFinished && (
            <div className="status-container">
              <p className="timer">Time Left: {timer}s</p>
              <p className="progress">
                {currentQuestionIndex + 1}/{questions.length}
              </p>
            </div>
          )}

          {!quizFinished && <h2>Welcome to the Quiz, {username}!</h2>}

          {quizFinished ? (
            <div className="result">
              <h2>Quiz Finished!</h2>{" "}
              <p>Total Questions Answered: {answeredQuestions} / 10</p>
              <p>Correct Answers: {correctAnswers}</p>
              <p>Wrong Answers: {questions.length - correctAnswers}</p>
              <p>Score: {scorePercentage}%</p>
              <button className="retry-btn" onClick={handleRetry}>
                Retry Quiz
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              {questions.length > 0 &&
              currentQuestionIndex < questions.length ? (
                <Question
                  data={questions[currentQuestionIndex]}
                  onAnswer={handleNext}
                  timer={timer}
                />
              ) : (
                <h2>Loading Questions...</h2>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Quiz;
