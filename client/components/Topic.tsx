import React, { useState } from 'react';

type Question= {
    id: number;
    text: string;
    options: string[];
}

const QuestionsComponent: React.FC = ()=>{
        return null
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

    //track question index State

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number> (0)


    // save/store answers State

    const [answers, setAnswers]= useState<string[]>([])

    //Function to save answer and move to next question
 const handleAnswer = (answer: string) => {
    setAnswers((prev)=>{
        return [...prev, answer]
    })
 }

}
