/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy 
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/


//words relating to school
const wordList = ['pencil', 'desk', 'marker', 'glue', 'scissors', 'notebook', 'binder', 'lunch', 'recess', 'subjects'];


function App() {
  //2. The game should be persistent. The player's progress should be tracked throughout the game and stored in local storage.
  const [words, setWords] = React.useState(() => {
    const saved = localStorage.getItem('scramble_words');
    return saved ? JSON.parse(saved) : shuffle(wordList);
  });

  const [points, setPoints] = React.useState(() =>
  parseInt(localStorage.getItem('scramble_points')) || 0
  );

  const [strikes, setStrikes] = React.useState(() =>
  parseInt(localStorage.getItem('scramble_strikes')) || 0
  );  

  const [passes, setPasses] = React.useState(() =>
  parseInt(localStorage.getItem('scramble_passes')) || 3
  );

  const [guess, setGuess] = React.useState('');
  const [message, setMessage] = React.useState('');

  //update local storage whenever the game changes
  React.useEffect(() => {
    localStorage.setItem('scramble_words', JSON.stringify(words));
    localStorage.setItem('scramble_points', points);
    localStorage.setItem('scramble_strikes', strikes);
    localStorage.setItem('scramble_passes', passes);
  }, [words, points, strikes, passes]);

  const handleGuessSubmit = (e) => {
    e.preventDefault(); 
    
    //Guess handling
    const currentWord = words[0];
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setMessage('Correct!');
      setPoints(points + 1);
      setWords(words.slice(1)); 
    } else {
      setMessage('Incorrect, try again!');
      setStrikes(strikes + 1);
    }
    setGuess(''); 
  };

  //pass handling
  const handlePass = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      setWords(words.slice(1));
      setMessage('Word passed.');
    }
  };

  //reset to start a fresh game
  const restartGame = () => {
    setWords(shuffle(wordList));
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setMessage('');
  };

  //game over screen
  if (strikes >= 3 || words.length === 0) {
    return (
      <div className="game-container">
        <h1>Game Over</h1>
        <p>Your Final Score: {points}</p>
        <button onClick={restartGame}>Play Again</button>
      </div>
    );
  }

  //displays game on site
  return (
    <div className="game-container">
      <h1>Welcome to Scramble.</h1>
      <div className="stats">
        <p>Points: {points} | Strikes: {strikes} | Passes: {passes}</p>
      </div>

      <div className="game-board">
        <h2 className="scrambled-display">{shuffle(words[0])}</h2>
        
        {message && <p className="msg">{message}</p>}

        <form onSubmit={handleGuessSubmit}>
          <input type="text" value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Enter your guess"/>


          <div className="actions">
            <button type="submit">Guess</button>
            <button onClick={handlePass} disabled={passes <= 0} className="pass-btn">
            Pass
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);