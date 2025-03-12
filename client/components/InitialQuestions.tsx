import React, { useState, useEffect } from 'react';

export type Question= {
  text: string;
  options: string[];
}

interface ChildProps {
  updateResponse: (newResponse: string) => void; 
  onStateChange: (state: boolean) => void;
}

const QuestionsComponent: React.FC<ChildProps> = ({updateResponse, onStateChange})=>{
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number> (0)
  const [answers, setAnswers]= useState<string[]>([])
  const [questionsCompleted, setQuestionsCompleted] = useState<boolean>(false)

  const questions: Question[] = [
    {
      text: 'Select your programming language',
      options: ['JavaScript', 'TypeScript', 'Python', 'Java']
    },
    {
      text: 'Choose a topic',
      options: ['Algorithms', 'Data Structures']
    }, 
    {
      text: 'Select level of difficulty',
      options: ['Easy', 'Medium', 'Hard']
    }
  ]

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

      try {
        const parameters = `Language: ${answers[0]}, Topic: ${answers[1]}, Difficulty: ${answers[2]}`;
        // console.log("These are the parameters being sent to the server:", parameters); 
        const res = await fetch('/openai-api', { //! confirm endpoint
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json', 
          }, 
          body: JSON.stringify({ parameters }), //! confirm structure of data
        });
        const data = await res.json(); 
        updateResponse(data); //! confirm format of response
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

