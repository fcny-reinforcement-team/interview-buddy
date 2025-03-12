import React, { useState, useEffect } from 'react';

export type Question= {
  text: string;
  options: string[];
  colors?: string[];
}

interface ChildProps {
  updateChatResponse: (newResponse: string) => void; 
  onStateChange: (state: boolean) => void;
}

const QuestionsComponent: React.FC<ChildProps> = ({updateChatResponse, onStateChange})=>{
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number> (0)
  const [answers, setAnswers]= useState<string[]>([])
  const [questionsCompleted, setQuestionsCompleted] = useState<boolean>(false)

  const questions: Question[] = [
    {
      text: 'Select your programming language',
      options: ['JavaScript', 'TypeScript', 'Python', 'Java'],
      colors: ['bg-[#9BC4CB]', 'bg-[#CFEBDF]', 'bg-[#83886F]', 'bg-[#DBEFBC]']
    },
    {
      text: 'Choose a topic',
      options: ['Algorithms', 'Data Structures'],
      colors: ['bg-[#DBEFBC]', 'bg-[#9BC4CB]']

    }, 
    {
      text: 'Select level of difficulty',
      options: ['Easy', 'Medium', 'Hard'],
      colors: ['bg-[#CFEBDF]', 'bg-[#DBEFBC]', 'bg-[#83886F]']
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

  useEffect(() => {
    console.log("Updated questionsCompleted state variable:", questionsCompleted);
  }, [questionsCompleted]);

//   useEffect(() => {
//     console.log("Updated current question index:", currentQuestionIndex);
//   }, [currentQuestionIndex]); 

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
      console.log('This is the sessionId generated when the questions are completed:', sessionId); 
      try {
        
        const parameters = {
          sessionId, 
          language: `${answers[0]}`, 
          topic: `${answers[1]}`, 
          difficulty: `${answers[2]}`, 
          userMessage: "Let's start the interview."
        };
        console.log('These are the parameters being sent in the post request:', parameters); 
        // console.log("These are the parameters being sent to the server:", parameters); 
        const res = await fetch('/api/message', { 
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json', 
          }, 
          body: JSON.stringify({ parameters }), 
        });
        const data = await res.json(); 
        console.log('This is the data returned from the initial request to the api:', data.message); 
        updateChatResponse(data.message);
      } catch (error) {
        console.error('Error fetching OpenAI API:', error); 
      }
    }
    sendParameters(); 
    handleQuestionsCompletedStateChange(true); 
  }

  return (
    <div>
      {!questionsCompleted && answers.length < questions.length ? (
        <div>
          <h1 className='question'>{currentQuestion.text}</h1>
          {currentQuestion.options.map((option: string, index: number)=>(
            <button className='option' key={index} onClick={()=> handleAnswer(option)}>{option}</button>
          ))}
        </div>
      ) : (
        <div>
          
        </div>
      )}
    </div>
  )
}

export default QuestionsComponent; 

