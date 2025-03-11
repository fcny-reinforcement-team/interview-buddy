import React, { useState } from 'react';

export type Question= {
  id: number;
  text: string;
  options: string[];
}

interface ChildProps {
  updateResponse: (newResponse: string) => void; 
  onStateChange: (state: boolean) => void;
}

const QuestionsComponent: React.FC<ChildProps> = ({updateResponse, onStateChange})=>{
    //track question index State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number> (0)
    // save/store answers State
    const [answers, setAnswers]= useState<string[]>([])
    //track completed questions
    const [completed, setCompleted] = useState<boolean>(false)

    const questions: Question[] = [
      {
            id: 1,
            text: 'Select your Language',
            options: ['JaveScript', 'TypeScript', 'Python', 'Java']
      },
        {
            id: 2,
            text: 'Choose a Topic',
            options: ['Algos', 'Data Structures', 'Bit of Both']
        }, 
        {
            id: 3,
            text: 'Select Level',
            options: ['Easy', 'Medium', 'Hard']
        }
    ]
    let currentQuestion = questions[currentQuestionIndex]

    const handleStateChange = (stateChange: boolean) => {
      setCompleted(stateChange); 
      console.log('This is the current questions state:', completed); 
      onStateChange(stateChange); 
    }

    //Function to save answer and move to next question
    const handleAnswer = (answer: string) => {
      const newAnswers = [...answers, answer]
      console.log('This is the updated newAnswers variable:', newAnswers);
      setAnswers(newAnswers)
      console.log('This is the updated answers state variable:', answers);
      if (currentQuestionIndex !== questions.length){
        setCurrentQuestionIndex((currentQuestionIndex) =>  currentQuestionIndex + 1)
        console.log('This is the current question index:', currentQuestionIndex)
        if (currentQuestionIndex === 2) {
            handleCompletedQuestions(); 
        }
      } 
    }

    const handleCompletedQuestions = () => {
        console.log('The condition in the handleAnswer function has been met'); 
        const sendParameters = async () => {
            console.log("Send to backend", answers); 
            if (!answers[0] || !answers[1] || !answers[2]) return; //! add error message
            try {
              const parameters = `Language: ${answers[0]}, Topic: ${answers[1]}, Difficulty: ${answers[2]}`;
              const res = await fetch('/openai-api', { //! figure out link
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json', 
                }, 
                body: JSON.stringify({ parameters }), //! confirm 
              });
              const data = await res.json(); 
              updateResponse(data); //! figure out format of response
        
            } catch (error) {
              console.error('Error fetching OpenAI API:', error); 
            }
          }
          sendParameters(); 
          handleStateChange(true); 
    }

//  const sendToBackend = (answers:string[])=>{
//     console.log("Send to backend", answers)
//   }


 return (
    <div>
        {currentQuestionIndex >= 3 ? <div></div> : <h1>{currentQuestion.text}</h1>}
    {currentQuestionIndex >= 3 ? <div></div> : currentQuestion.options.map((option: string, index: number)=>(
      <button key={index} onClick={()=> handleAnswer(option)}>
        {option}
        </button>
    ))}  
    </div>
  )
}

export default QuestionsComponent; 