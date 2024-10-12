import { useEffect, useState } from "react";
import axios from "axios"; // Axios is used to fetch questions from an API
import Question from "./Question"; // Import the Question component
import { useNavigate } from "react-router-dom";

// Quiz component handles the quiz logic and user progress
const Quiz = () => {
  const [questions, setQuestions] = useState([]); // Stores the list of questions fetched from the API
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Tracks the index of the current question
  const [correctAnswers, setCorrectAnswers] = useState(0); // Stores the count of correct answers
  const [timer, setTimer] = useState(10); // Initializes a 10-second timer for each question
  const [quizFinished, setQuizFinished] = useState(false); // Tracks whether the quiz is finished
  const [timerMessage, setTimerMessage] = useState(""); // Stores messages related to the timer
  const [quizStarted, setQuizStarted] = useState(false); // Tracks whether the quiz has started
  const username = localStorage.getItem("currentUser") || ""; // Retrieve the current user's username from localStorage

  const navigate = useNavigate(); // Hook to navigate between pages

  // Load saved progress for the current user when the component mounts
  useEffect(() => {
    if (username) {
      const savedProgress = localStorage.getItem(`quizProgress_${username}`); // Retrieve saved progress from localStorage
      if (savedProgress) {
        const {
          savedQuestions,
          savedCurrentQuestionIndex,
          savedCorrectAnswers,
          savedTimer,
          savedQuizFinished,
        } = JSON.parse(savedProgress); // Parse the saved progress

        setQuestions(savedQuestions); // Restore the saved questions
        setCurrentQuestionIndex(savedCurrentQuestionIndex); // Restore the current question index
        setCorrectAnswers(savedCorrectAnswers); // Restore the correct answers count
        setTimer(savedTimer); // Restore the timer value
        setQuizFinished(savedQuizFinished); // Restore the quiz finished status
        setQuizStarted(true); // Set quiz to started if progress is found
      }
    }
  }, [username]); // This effect runs when the component mounts or when username changes

  // Save quiz progress whenever relevant state changes
  useEffect(() => {
    if (quizStarted && username) {
      const quizProgress = {
        savedQuestions: questions,
        savedCurrentQuestionIndex: currentQuestionIndex,
        savedCorrectAnswers: correctAnswers,
        savedTimer: timer,
        savedQuizFinished: quizFinished,
      };
      localStorage.setItem(
        `quizProgress_${username}`,
        JSON.stringify(quizProgress)
      ); // Save progress to localStorage
    }
  }, [
    currentQuestionIndex,
    correctAnswers,
    timer,
    quizFinished,
    quizStarted,
    username,
  ]); // This effect runs when any of these states change

  // Fetch questions from an API if not already loaded
  useEffect(() => {
    if (questions.length === 0) {
      axios
        .get(
          "https://opentdb.com/api.php?amount=10&category=30&difficulty=easy&type=multiple"
        ) // Fetch 10 questions of type multiple-choice from the API
        .then((response) => {
          setQuestions(response.data.results); // Set the questions in the state
        })
        .catch((error) => {
          console.error("Error fetching questions:", error); // Log any errors
        });
    }
  }, [questions]); // This effect runs when questions is empty

  // Timer logic to count down the timer for each question
  useEffect(() => {
    if (quizFinished || !quizStarted) return; // Do nothing if the quiz is finished or hasn't started

    if (timer === 0) {
      if (currentQuestionIndex < questions.length - 1) {
        handleNext(false); // If time runs out, mark the answer as incorrect and move to the next question
      } else {
        setQuizFinished(true); // Finish the quiz if all questions are done
        setTimerMessage("Times Up"); // Display "Times Up" message
      }
    }

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1); // Decrease the timer by 1 every second
    }, 1000);

    return () => clearInterval(countdown); // Clear the timer when the component unmounts or when the effect re-runs
  }, [timer, quizFinished, quizStarted]); // This effect runs when timer, quizFinished, or quizStarted changes

  const handleStart = () => {
    setQuizStarted(true); // Starts the quiz
  };

  const handleRetry = () => {
    localStorage.removeItem(`quizProgress_${username}`); // Remove saved progress from localStorage
    setQuizStarted(false); // Reset quiz states
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setTimer(10);
    setTimerMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // Remove the current user from localStorage
    localStorage.removeItem(`quizProgress_${username}`); // Remove saved progress from localStorage on logout
    navigate("/"); // Navigate back to the login page
  };

  const handleNext = (isCorrect) => {
    if (isCorrect) setCorrectAnswers(correctAnswers + 1); // Increment the correct answer count if the answer is correct
    setTimer(10); // Reset the timer for the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to the next question
    } else {
      setQuizFinished(true); // Finish the quiz if there are no more questions
      setTimerMessage("Quiz Done"); // Display "Quiz Done" message
    }
  };

  // Calculate the percentage score
  const scorePercentage = ((correctAnswers / questions.length) * 100).toFixed(
    2
  ); // Calculate the score as a percentage with 2 decimal points

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
          <div className="status-container">
            {quizFinished ? (
              <p className="timer">{timerMessage}</p> // Display the timer message when quiz is finished
            ) : (
              <p className="timer">Time Left: {timer}s</p> // Display the remaining time
            )}
            <p className="progress">
              {currentQuestionIndex + 1}/{questions.length}{" "}
              {/* Display the current question index and total number of questions */}
            </p>
          </div>

          {!quizFinished && <h2>Welcome to the Quiz, {username}!</h2>}

          {quizFinished ? (
            <div className="result">
              <h2>Quiz Finished!</h2>
              <p>Total Questions: {questions.length}</p>
              <p>Correct Answers: {correctAnswers}</p>
              <p>Wrong Answers: {questions.length - correctAnswers}</p>
              <p>Score: {scorePercentage}%</p>{" "}
              {/* Display the score percentage */}
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
                  data={questions[currentQuestionIndex]} // Pass the current question data to the Question component
                  onAnswer={handleNext} // Handle the answer when selected
                  timer={timer} // Pass the current timer value to the Question component
                />
              ) : (
                <h2>Loading Questions...</h2> // Display loading message while questions are being fetched
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Quiz; // Export the Quiz component
