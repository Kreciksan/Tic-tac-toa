import { useState } from 'react'
import './App.css'

function Square({value, onSquareClick}) {
 
  return (
    <div className='square' onClick={onSquareClick}>
      {value}
    </div>
    );
}

function Board({xIsNext, squares, onPlay}) {

  function handleClick(i) {
    if(squares[i] || calculateWinner(squares)) return;

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
        return squares[a];
      }
    }
    return null;
  }

  const winner = calculateWinner(squares);
  let status;

  if(winner) status = "The winner is " + winner;
  else status = 'The next player is "' + (xIsNext ? "X" : "O") + '"';

  return (
    <>
      <h1 className='status'>{status}</h1>

      {Array(3).fill(null).map((_, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {Array(3).fill(null).map((_,index) => (
            <Square key={index + (rowIndex * 3)} value={squares[index + (rowIndex * 3)]} onSquareClick={() => handleClick(index + (rowIndex * 3))} />
          ))}
        </div>
      )
        
      )}
      
    </>
  )
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSqeares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSqeares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length -1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if(move > 0) {
      description = 'Go to move #' + move;
    }
    else {
      description = 'Go to the start';
    }

    if(move === (history.length - 1)) {
      return (
        <li key={move}>
          <p>You are at move #{move+1}</p>
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

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>

  )
}

export default Game
