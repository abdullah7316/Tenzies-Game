import React from "react";
import ReactConfetti from "react-confetti";
import Dice from "./components/dice";

export default function App() {
  let [bestScore, setBestScore] = React.useState(
    JSON.parse(localStorage.getItem('bestScore'))
    || {
      time: '00:00',
      rolls: 0
    });
  let [rollTimes, setRollTimes] = React.useState(1);
  let [diceData, setDiceData] = React.useState(returnDiceData())
  let [elapsedTime, setElapsedTime] = React.useState(
    {
      count: false,
      seconds: 0,
      minutes: 0
    }
  )
  let [gameStatus, setGameStatus] = React.useState(
    {
      firstValue: 0,
      select: false,
      gameover: false
    }
  )
  React.useEffect(
    () => {
      if (elapsedTime.count) {
        let timer = setInterval(
          () => {
            setElapsedTime(prevObj => {
              return {
                ...prevObj,
                seconds: prevObj.seconds + 1
              }
            })
          }, 600);
        if (elapsedTime.seconds === 59) {
          setElapsedTime(prevObj => {
            return {
              ...prevObj,
              minutes: prevObj.minutes + 1,
              seconds: 0
            }
          })
        }
        return () => clearInterval(timer);
      }
    }
  )

  React.useEffect(
    () => {
      if (checkGameover()) {
        setGameStatus(
          {
            ...gameStatus,
            gameover: true
          }
        )
        setElapsedTime(prev => {
          return {
            ...prev,
            count: false
          }
        })
        console.log('Best score rolls ' + bestScore.rolls)
        function setBestScoreToLocalStorage() {
          let timeText = document.getElementById('time-text').innerText;
          setBestScore(
            {
              time: timeText,
              rolls: rollTimes
            }
          )
        }
        if (bestScore.rolls === 0) {
          setBestScoreToLocalStorage();
        } else if (rollTimes < bestScore.rolls) {
          setBestScoreToLocalStorage();
        }
      }
    }, [diceData]
  )
  React.useEffect(
    () => {
      localStorage.setItem('bestScore', JSON.stringify(bestScore))
    }, [bestScore]
  )

  function returnDiceData() {
    let array = [];
    for (let i = 0; i < 10; i++) {
      array.push({
        value: randomDiceNum(),
        match: false,
        id: i
      })
    }
    return array;
  }
  function checkGameover() {
    for (let i = 0; i < 10; i++) {
      if (!diceData[i].match) {
        return false;
      }
    }
    return true;
  }

  let allDiceComponents = diceData.map(die => {
    return <Dice
      key={die.id}
      id={die.id}
      diceNum={die.match ? gameStatus.firstValue : die.value}
      onClick={toggleHeld}
      color={die.match}
    />
  })

  function toggleHeld(num, id) {
    function setMatch() {
      setDiceData(prevState => prevState.map(die => {
        if (die.id === id) {
          return {
            ...die,
            match: true
          }
        }
        return die;
      }))
    }

    if (gameStatus.select) {
      if (gameStatus.firstValue === num) {
        setMatch()
      }
    } else {
      setGameStatus(
        {
          ...gameStatus,
          firstValue: num,
          select: true
        }
      )
      setMatch()
      setElapsedTime(prevObj => {
        return {
          ...prevObj,
          count: true
        }
      })
    }
  }

  function randomDiceNum() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function rollDices() {
    setDiceData(prevState => prevState.map(die => {
      if (die.match) {
        return die;
      }
      return {
        ...die,
        value: randomDiceNum()
      }
    }))
    if (gameStatus.select) {
      setRollTimes(value => ++value)
    }
  }

  function resetGame() {
    setElapsedTime(
      {
        count: false,
        seconds: 0,
        minutes: 0
      }
    )
    setRollTimes(1);
    setDiceData(returnDiceData());
    setGameStatus(
      {
        firstValue: 0,
        select: false,
        gameover: false
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
      {gameStatus.gameover ?
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
          {gameStatus.gameover ?
            <></> :
            <input
              className="reset--btn"
              type="button"
              value="Reset"
              onClick={resetGame}
            />}
        </div>
        <div className="bestscore--div flex-all-center">
          <div>
            <p>"Best Score"</p>
            <p>Rolls------{bestScore.rolls} </p>
            <p>Time-{bestScore.time}</p>
          </div>
        </div>
        <div className="dice--area">
          {gameStatus.gameover ?
            <>
              <h1 className="win">You WON</h1>
              <p className="win--detail">In {rollTimes} Rolls <br />
                In {elapsedTime.minutes < 1 ?
                  elapsedTime.seconds + 'seconds' :
                  elapsedTime.minutes > 1 ?
                    elapsedTime.minutes + ' minutes and ' + elapsedTime.seconds + ' seconds' :
                    elapsedTime.minutes + ' minute and ' + elapsedTime.seconds + ' seconds'} </p>
            </> : allDiceComponents}
        </div>
        <div className="roll--btn--area flex-all-center">
          {gameStatus.gameover ?
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
              <p id="rolls-text">{
                rollTimes > 1 ?
                  `${rollTimes} Rolls` :
                  `${rollTimes} Roll`
              } |</p>
              <p id="time-text">
                {
                  elapsedTime.minutes < 10 ?
                    '0' + elapsedTime.minutes :
                    elapsedTime.minutes
                } :
                {
                  elapsedTime.seconds < 10 ?
                    '0' + elapsedTime.seconds :
                    elapsedTime.seconds
                }
              </p>
            </>}
        </div>
      </div>
    </div>
  )
}