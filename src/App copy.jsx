import React from "react";
import ReactConfetti from "react-confetti";
import Dice from "./components/dice";

export default function App() {
  let [rollTimes, setRollTimes] = React.useState(1);
  let [gameover, setGameover] = React.useState(false);
  let [diceMatch, setDiceMatch] = React.useState(allDiceMatch());
  let [allDiceState, setAllDiceState] = React.useState(
    {
      firstNum: 0,
      select: false,
      number: allDiceNum(),
      id: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  );

  React.useEffect(
    () => {
      if (checkGameover()) {
        setGameover(true)
      }
    }, [diceMatch]
  )

  function allDiceComponents() {
    let array = [];
    for (let i = 0; i < 10; i++) {
      array.push(
        <Dice
          key={allDiceState.id[i]}
          id={allDiceState.id[i]}
          diceNum={diceMatch[i] ? allDiceState.firstNum : allDiceState.number[i]}
          onClick={toggleHeld}
          color={diceMatch[i]}
        />)
    }
    return array;
  }

  function toggleHeld(num, id) {

    let newMatch = [];
    for (let i = 0; i < 10; i++) {
      if (id === i) {
        newMatch[i] = true;
      } else {
        newMatch[i] = diceMatch[i];
      }
    }

    if (allDiceState.select) {
      if (num == allDiceState.firstNum) {
        setDiceMatch(newMatch)
      }
    } else {
      setAllDiceState(prevState => {
        return {
          ...prevState,
          firstNum: num,
          select: true
        }
      })
      setDiceMatch(newMatch)
    }
  }

  function checkGameover() {
    for (let i = 0; i < 10; i++) {
      if (!diceMatch[i]) {
        return false;
      }
    }
    return true;
  }

  function allDiceNum() {
    let numArr = [];
    for (let i = 0; i < 10; i++) {
      numArr[i] = randomDiceNum();
    }
    return numArr;
  }

  function allDiceMatch() {
    let matchArr = [];
    for (let i = 0; i < 10; i++) {
      matchArr[i] = false;
    }
    return matchArr;
  }

  function randomDiceNum() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function rollDices() {
    setAllDiceState(prevState => {
      return {
        ...prevState,
        number: allDiceNum()
      }
    })
    if (allDiceState.select) {
      setRollTimes(value => ++value)
    }
  }
  function resetGame() {
    setRollTimes(1);
    setGameover(false);
    setDiceMatch(allDiceMatch());
    setAllDiceState(
      {
        firstNum: 0,
        select: false,
        number: allDiceNum(),
        id: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      }
    )
  }

  //Confetti Code
  let [windowDimension, setWindowDimension] = React.useState(
    {
      width: window.innerWidth,
      height: window.innerHeight
    }
  )

  React.useEffect(
    () => {
      window.addEventListener('resize',
        () => {
          setWindowDimension(
            {
              width: window.innerWidth,
              height: window.innerHeight
            }
          )
        })
    }, [windowDimension]
  )

  return (
    <div className="container flex-all-center">
      {gameover ?
        <ReactConfetti
          className="confetti"
          width={windowDimension.width}
          height={windowDimension.height}
          numberOfPieces={200}
          recycle={false}
          gravity={0.2}
        /> :
        ''}
      <div className="content--div">
        <div className="header--div flex-all-center">
          <h1 className="title">Tenzies</h1>
          {gameover ?
            <></> :
            <input
              className="reset--btn"
              type="button"
              value="Reset"
              onClick={resetGame}
            />}

        </div>
        <div className="dice--area">
          {gameover ?
            <>
              <h1 className="win">You WON</h1>
              <p className="win--detail">In just {rollTimes} Rolls</p>
            </> : allDiceComponents()}
        </div>
        <div className="roll--btn--area flex-all-center">
          {gameover ?
            <input
              className="play--again--btn"
              type="button"
              value="Play Again"
              onClick={resetGame}
            /> :
            <>
              <input
                className="dice--btn"
                type="button"
                value="Roll"
                onClick={rollDices}
              />
              <p>{
                rollTimes > 2 ?
                  `${rollTimes} Times` :
                  `${rollTimes} Time`
              }
              </p>
            </>}
        </div>
      </div>
    </div>
  )
}