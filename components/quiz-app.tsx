"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ClipLoader from "react-spinners/ClipLoader";

// Define the Answer type
type Answer = {
  text: string;
  isCorrect: boolean;
};

// Define the Question type
type Question = {
  question: string;
  answers: Answer[];
};

// Define the QuizState type
type QuizState = {
  currentQuestion: number;
  score: number;
  showResults: boolean;
  questions: Question[];
  isLoading: boolean;
};

export default function QuizApp() {
  // State to manage the quiz
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    showResults: false,
    questions: [],
    isLoading: true,
  });

  // useEffect to fetch quiz questions from API when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=10&type=multiple"
        );
        const data = await response.json();
        const questions = data.results.map((item: any) => {
          const incorrectAnswers = item.incorrect_answers.map(
            (answer: string) => ({
              text: answer,
              isCorrect: false,
            })
          );
          const correctAnswer = {
            text: item.correct_answer,
            isCorrect: true,
          };
          return {
            question: item.question,
            answers: [...incorrectAnswers, correctAnswer].sort(
              () => Math.random() - 0.5
            ),
          };
        });
        setState((prevState) => ({
          ...prevState,
          questions,
          isLoading: false,
        }));
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Function to handle answer click
  const handleAnswerClick = (isCorrect: boolean): void => {
    if (isCorrect) {
      setState((prevState) => ({ ...prevState, score: prevState.score + 1 }));
    }

    const nextQuestion = state.currentQuestion + 1;
    if (nextQuestion < state.questions.length) {
      setState((prevState) => ({
        ...prevState,
        currentQuestion: nextQuestion,
      }));
    } else {
      setState((prevState) => ({ ...prevState, showResults: true }));
    }
  };

  // Function to reset the quiz
  const resetQuiz = (): void => {
    setState({
      currentQuestion: 0,
      score: 0,
      showResults: false,
      questions: state.questions,
      isLoading: false,
    });
  };

  // Show loading spinner if the questions are still loading
  if (state.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <ClipLoader color="#ffffff" size={100} />
        <p className="mt-4 text-lg">Loading quiz questions, please wait...</p>
      </div>
    );
  }

  // Show message if no questions are available
  if (state.questions.length === 0) {
    return <div>No questions available.</div>;
  }

  // Get the current question
  const currentQuestion = state.questions[state.currentQuestion];

  // JSX return statement rendering the Quiz UI
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {state.showResults ? (
        // Show results if the quiz is finished
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-gray-900 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-500">Quiz Results</h2>
          <p className="text-lg mb-4">
            You scored {state.score} out of {state.questions.length}
          </p>
          <Button
            onClick={resetQuiz}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 text-white"
          >
            Try Again
          </Button>
        </div>
      ) : (
        // Show current question and answers if the quiz is in progress
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-gray-900">
          <h2 className="text-2xl font-bold mb-4 text-blue-500">
            Question {state.currentQuestion + 1}/{state.questions.length}
          </h2>
          <p
            className="text-lg mb-6"
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
          />
          <div className="grid gap-4">
            {currentQuestion.answers.map((answer, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerClick(answer.isCorrect)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 text-white p-4 rounded-lg shadow-md"
              >
                {answer.text}
              </Button>
            ))}
          </div>
          <div className="mt-6 text-right">
            <span className="text-sm text-gray-600">Score: {state.score}</span>
          </div>
        </div>
      )}
                        {/* Footer section */}
                        <footer className="mt-4 text-sm text-gray-300 text-muted-foreground">
        Created By Ismail Ahmed Shah
      </footer>
    </div>
    
  );
}
