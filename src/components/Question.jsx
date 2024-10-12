import { useEffect, useState } from "react";

const Question = ({ data, onAnswer }) => {
  const { question, incorrect_answers, correct_answer } = data;
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    const answers = [...incorrect_answers, correct_answer];
    setShuffledAnswers(answers.sort(() => Math.random() - 0.5));
  }, [data]);

  const handleAnswer = (answer) => {
    onAnswer(answer === correct_answer);
  };

  return (
    <div>
      <h3 dangerouslySetInnerHTML={{ __html: question }} />

      {shuffledAnswers.map((answer, index) => (
        <button
          key={index}
          onClick={() => handleAnswer(answer)}
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      ))}
    </div>
  );
};

export default Question;
