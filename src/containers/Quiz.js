import { useEffect, useState } from 'react';
import { useSpeechSynthesis, useSpeechRecognition } from "react-speech-kit";
import questions from './questions.js';
import './Quiz.css'

const Quiz = () =>{
    const [question, setQuestion] = useState(0);
    const [value, setValue] = useState("");
    const { speak, speaking, cancel } = useSpeechSynthesis();
    const { listen, stop } = useSpeechRecognition({
        onResult: (result) => {
            console.log(result)
            setValue(result);
        },
    });

    useEffect(()=>{
        switch (value) {
            case "read question":
                speak({text: questions[question].question, queue: false});
                break;

            case "read options":
                speak({text: questions[question].options, queue: false});
                break;
        
            default:
                break;
        }
    },[value])

    return(
        <div className="Quiz">
            <h1>Quiz</h1>
            <div className="question-section">
                <p className="question"> {questions[question].question}</p>
                <div className="options">
                    <button className="option">{questions[question].options[0]}</button>
                    <button className="option">{questions[question].options[1]}</button>
                    <button className="option">{questions[question].options[2]}</button>
                    <button className="option">{questions[question].options[3]}</button>
                </div>
            </div>
            <div onClick={()=>{listen({interimResults: false})}} className="voice-recog">Start Voice Recognition</div>
        </div>
    )
}

export default Quiz;