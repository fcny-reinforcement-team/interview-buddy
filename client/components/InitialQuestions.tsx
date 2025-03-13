import React, { useState, useEffect } from 'react';
import '../styles/initialQuestions.css';

export type Question= {
  text: string;
  options: string[];
  colors: string[];
  colorsHovered: string[]; 
}

interface ChildProps {
  updateChatArray: (newResponse: string) => void; 
  onStateChange: (state: boolean) => void;
}

const QuestionsComponent: React.FC<ChildProps> = ({updateChatArray, onStateChange})=>{
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0); 
  const [answers, setAnswers]= useState<string[]>([]); 
  const [questionsCompleted, setQuestionsCompleted] = useState<boolean>(false); 
  const [hoveredButtonIndex, setHoveredButtonIndex] = useState<number | null>(null); 

  const questions: Question[] = [
    {
      text: 'Select your programming language',
      options: ['JavaScript', 'TypeScript', 'Python', 'Java'],
      colors: ['#9BC4CB', '#CFEBDF', '#83886F', '#DBEFBC'], 
      colorsHovered: ['#B0DEE6', '#DDFFF0', '#ADB48F', '#EEFFD3']
    },
    {
      text: 'Choose a topic',
      options: ['Algorithms', 'Data Structures'],
      colors: ['#DBEFBC', '#9BC4CB'], 
      colorsHovered: ['#EEFFD3', '#B0DEE6']
    }, 
    {
      text: 'Select level of difficulty',
      options: ['Easy', 'Medium', 'Hard'],
      colors: ['#CFEBDF', '#DBEFBC', '#83886F'], 
      colorsHovered: ['#DDFFF0', '#EEFFD3', '#ADB48F']
    }
  ]

  const getSessionId = () => {
    let sessionId = localStorage.getItem("sessionId")
    if (!sessionId) {
      sessionId = "session-" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  }

  useEffect(() => {
    // console.log("Updated answers state variable:", answers);
    if (answers.length === questions.length) {
      handleCompletedQuestions();
    }
  }, [answers]);

//   useEffect(() => {
//     console.log("Updated questionsCompleted state variable:", questionsCompleted);
//   }, [questionsCompleted]);

//   useEffect(() => {
//     console.log("Updated current question index:", currentQuestionIndex);
//   }, [currentQuestionIndex]); 

  const handleMouseEnter = (buttonIndex: number) => {
    setHoveredButtonIndex(buttonIndex); 
  }

  const handleMouseLeave = () => {
    setHoveredButtonIndex(null);
  }

  let currentQuestion = questions[currentQuestionIndex]

  const handleQuestionsCompletedStateChange = (stateChange: boolean) => {
    setQuestionsCompleted(stateChange); 
    onStateChange(stateChange); 
  }

  //Function to save answer and move to next question
  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)
    if (currentQuestionIndex < questions.length - 1){
      setCurrentQuestionIndex((currentQuestionIndex) =>  currentQuestionIndex + 1)
    } 
  }

  const handleCompletedQuestions = () => {
    const sendParameters = async () => {
      if (!answers[0] || !answers[1] || !answers[2]) {
        return  //! add error message
      }

      const sessionId = getSessionId();
    //   console.log('This is the sessionId generated when the questions are completed:', sessionId); 
      try {
        const parameters = {
          sessionId, 
          language: `${answers[0]}`, 
          topic: `${answers[1]}`, 
          difficulty: `${answers[2]}`, 
          userMessage: "Let's start the interview."
        };
        // console.log('These are the parameters being sent in the post request:', parameters); 
        const res = await fetch('/api/message', { 
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json', 
          }, 
          body: JSON.stringify({ parameters }), 
        });
        const data = await res.json(); 
        //console.log('This is the data returned from the initial request to the api:', data.message); 
        updateChatArray(data.message);
      } catch (error) {
        console.error('Error fetching OpenAI API:', error); 
      }
    }
    sendParameters(); 
    handleQuestionsCompletedStateChange(true); 
  }

  return (
    <>
      {!questionsCompleted && answers.length < questions.length ? (
        <div className='chat-questions-container chat-content'>
          <h1 className='chat-content-elems chat-content-question'>{currentQuestion.text}</h1>
          <div className='chat-content-elems'>
          {currentQuestion.options.map((option: string, index: number) => (
            <button className='chat-content-option' 
              key={index} 
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              style={{ backgroundColor: hoveredButtonIndex === index ? currentQuestion.colorsHovered[index] : currentQuestion.colors[index]}}
              onClick={()=> handleAnswer(option)}>{option}
            </button>
          ))}
          </div>
        </div>
      ) : (
        <div>
        </div>
      )}
    </>
  )
}

export default QuestionsComponent; 

