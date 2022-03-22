// Importing the required components
import Board from './containers/Board';

// Importing the CSS File
import "./App.css";
import Quiz from './containers/Quiz';

function App() {

    return (
        <div className="App">
            {/* Shrinks the popup when there is no winner */}
            {/* Custom made board component comprising of 
            the tic-tac-toe board  */}
            {/* <Board /> */}
            <Quiz/>
            {/* <Info /> */}
        </div>
    );
}

export default App;