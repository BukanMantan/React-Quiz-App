import { useEffect, useState } from "react";

// Question component to display a single quiz question and handle the answer
const Question = ({ data, onAnswer }) => {
  const { question, incorrect_answers, correct_answer } = data; // Destructure question data
  const [shuffledAnswers, setShuffledAnswers] = useState([]); // Stores the shuffled answers (both correct and incorrect)

  // useEffect hook to shuffle answers whenever the question changes
  useEffect(() => {
    const answers = [...incorrect_answers, correct_answer]; // Combine correct and incorrect answers
    setShuffledAnswers(answers.sort(() => Math.random() - 0.5)); // Randomly shuffle the answers
  }, [data]); // Re-run this effect when the 'data' (question) changes

  // Function to handle answer selection
  const handleAnswer = (answer) => {
    onAnswer(answer === correct_answer); // Check if the selected answer is correct and pass the result to the parent component (Quiz.jsx)
  };

  return (
    <div>
      {/* Render the question text, using dangerouslySetInnerHTML to display any HTML entities correctly */}
      <h3 dangerouslySetInnerHTML={{ __html: question }} />

      {/* Render each shuffled answer as a button */}
      {shuffledAnswers.map((answer, index) => (
        <button
          key={index} // Each button needs a unique key based on its index
          onClick={() => handleAnswer(answer)} // Calls handleAnswer function with the selected answer
          dangerouslySetInnerHTML={{ __html: answer }} // Display answer options safely with HTML formatting
        />
      ))}
    </div>
  );
};

export default Question; // Export the Question component
