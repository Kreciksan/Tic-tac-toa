import { useState } from 'react'
import './App.css'

function Square({isHighlighted, value, onSquareClick}) {
  
  return (
    <div className={'square ' + (isHighlighted ? 'square-highlighted': '') } onClick={onSquareClick}>
      {value}
    </div>
    );
}

function Board({xIsNext, squares, onPlay}) {

  
  const winningLines = calculateWinner(squares);
  let status;
  
  if(winningLines[0] != null) status = "The winner is " + squares[winningLines[0]];
  else if(!squares.includes(null)) status = "Draw"
  else status = 'The next player is "' + (xIsNext ? "X" : "O") + '"';

  function handleClick(i) {
    
    if(squares[i] || winningLines[0] != null) return;

    const nextSqeares = squares.slice();
    if(xIsNext) {
      nextSqeares[i] = 'X';
    }
    else {
      nextSqeares[i] = 'O';
    }
    onPlay(nextSqeares);

  }


  function calculateWinner(squares) {
    const lines = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];

    for(let i = 0; i < lines.length; i++) {
      const [a,b,c] = lines[i];
      
      if(squares[a] && squares[a] === squares[b] && squares[b]  === squares[c]) {
        return lines[i];
      }
    }
    return Array(3).fill(null);
  }

  return (
    <>
      <h1 className='status'>{status}</h1>

      {Array(3).fill(null).map((_, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {Array(3).fill(null).map((_,index) => {   
            const key =  index + (rowIndex * 3);
            return(
              <Square key={key} isHighlighted={winningLines.includes(key)}  value={squares[key]} onSquareClick={() => handleClick(key)} />
            )
          })}
        </div>
      )
        
      )}
      
    </>
  )
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  

  function handleToggleOrder() {
    setIsAscending(!isAscending);
  };

  function handlePlay(nextSqeares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSqeares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length -1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  let preSquares = [history[0].toString()];
  
  let moves = history.map((squares, move) => {

   
    
    
    let description;
    if(move > 0) {
      description = 'Go to move #' + move;
      // preSquares = history[move -1]
      // console.log(squares.toString());
      // console.log(preSquares.toString());
      // console.log("-------------");
      
      // console.log(squares.toString().replace(preSquares.toString(),' '));

    }
    else {
      description = 'Go to the start';
    }

    if(move === currentMove) {
      return (
        <li key={move}>
          <p>You are at {move == 0 ? 'the begining' : 'move #' + move}</p>
        </li>
      );
    }
    else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
    
  });



  const orderedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className='asc-toggle' onClick={handleToggleOrder}>{isAscending ? "Toggle to descending order" : "Toggle to ascending order"}</button>
        <ol>{orderedMoves}</ol>
      </div>
    </div>

  )
}

export default Game
