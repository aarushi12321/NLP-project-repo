import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import "./QuizFeature.css";

export function QuizFeature({ isQuizFeature, toggleQuizFeatureState, currentSession }) {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isQuizFeature && currentSession) {
      resetQuiz();
      generateNewQuiz();
    }
  }, [isQuizFeature, currentSession]);

  const resetQuiz = () => {
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizCompleted(false);
    setIsLoading(true);
  };

  const generateNewQuiz = () => {
    let combinedText = "";
    if (currentSession.chatHistory && currentSession.chatHistory.length > 0) {
      currentSession.chatHistory.forEach((message) => {
        combinedText += message.text + " ";
      });
    }

    combinedText = combinedText.trim();

    if (!combinedText) {
      console.error("No text found for the API request.");
      setIsLoading(false);
      return;
    }

    fetchQuizQuestions(combinedText);
  };

  const fetchQuizQuestions = async (text) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Based on the following user conversation, please generate a set of exactly 5 quiz questions with exactly 4 multiple choice options. Format the response as 'Question: [question]\nOptions: A) [option1], B) [option2], C) [option3], D) [option4]\nCorrect Answer: [A/B/C/D]'.",
            },
            { role: "user", content: text },
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_CHAT_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const generatedText = response.data.choices[0].message.content.trim();

      const questions = generatedText.split("\n\n").map((questionBlock) => {
        const [questionText, optionsText, correctAnswerText] = questionBlock.split("\n");
        const options = optionsText
          .split(", ")
          .map((option) => option.replace(/^[A-D]\)\s/, "").trim());
        const correctAnswer = correctAnswerText.replace("Correct Answer: ", "").trim();

        return {
          question: questionText.replace("Question: ", "").trim(),
          options: options,
          correctAnswer: correctAnswer,
        };
      });

      setQuizQuestions(questions);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching quiz questions from OpenAI:", error);
      setIsLoading(false);
    }
  };

  const handleAnswerSelection = (answer) => {
    const newUserAnswers = [...userAnswers, answer];
    setUserAnswers(newUserAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      const correctAnswer = quizQuestions[index].options[quizQuestions[index].correctAnswer.charCodeAt(0) - 65];
      return score + (answer === correctAnswer ? 1 : 0);
    }, 0);
  };

  const handleNewQuiz = () => {
    resetQuiz();
    generateNewQuiz();
  };

  if (!isQuizFeature) {
    return null;
  }

  return (
    <div className="quiz-feature-outer-box feature-active-quiz">
      <button
        className="close-quiz-feature-button"
        onClick={toggleQuizFeatureState}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>
      <div className="quiz-card-container">
        {isLoading ? (
          <div className="loading-card">
            <p>Loading quiz questions...</p>
          </div>
        ) : quizQuestions.length > 0 ? (
          !quizCompleted ? (
            <div className="quiz-card">
              <h4 className="quiz-question">{quizQuestions[currentQuestionIndex].question}</h4>
              <ul className="quiz-options-list">
                {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => handleAnswerSelection(option)}
                    className="quiz-option"
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="quiz-completion">
              <h2>Quiz Complete!</h2>
              <p>Your score: {calculateScore()} out of {quizQuestions.length}</p>
              {quizQuestions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const correctAnswer = question.options[question.correctAnswer.charCodeAt(0) - 65];
                const isCorrect = userAnswer === correctAnswer;

                return (
                  <div key={index} className="question-result">
                    <p><strong>Question {index + 1}:</strong> {question.question}</p>
                    <p>Your answer: {userAnswer}</p>
                    {isCorrect ? (
                      <p className="correct">Correct!</p>
                    ) : (
                      <>
                        <p className="incorrect">Incorrect</p>
                        <p>Correct answer: {correctAnswer}</p>
                      </>
                    )}
                  </div>
                );
              })}
              <button onClick={handleNewQuiz} className="new-quiz-button">Start New Quiz</button>
            </div>
          )
        ) : (
          <div className="error-card">
            <p>No quiz questions available. Please try again.</p>
            <button onClick={handleNewQuiz} className="new-quiz-button">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}