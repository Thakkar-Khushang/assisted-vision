
const Quiz = () =>{
    return(
        <div className="Quiz">
            <h1>Quiz</h1>
            <div className="question-section">
                <p className="question">What is your name?</p>
                <div className="options">
                    <button className="option">Option 1</button>
                    <button className="option">Option 2</button>
                    <button className="option">Option 3</button>
                    <button className="option">Option 4</button>
                </div>
            </div>
            <div className="question-section">
                <p className="question">What is your home address?</p>
                <div className="options">
                    <button className="option">Option 1</button>
                    <button className="option">Option 2</button>
                    <button className="option">Option 3</button>
                    <button className="option">Option 4</button>
                </div>
            </div>
            <div className="question-section">
                <p className="question">Chlti kya khandala?</p>
                <div className="options">
                    <button className="option">Yes</button>
                    <button className="option">Yes</button>
                    <button className="option">Yes</button>
                    <button className="option">Absolutely Yes</button>
                </div>
            </div>
        </div>
    )
}

export default Quiz;