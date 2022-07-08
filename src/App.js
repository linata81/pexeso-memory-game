import {useState, useEffect} from 'react';
import Images from './Images';
import { shuffle } from 'lodash';
import './App.css';

function App() {
  const [cards, setCards] = useState(shuffle([...Images,...Images]));
  const [activeCards, setActiveCards] = useState([]);
  const [foundPairs, setFoundPairs] = useState([]);
  const [clicks, setClicks] = useState(0);
  const [start, setStart] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [time, setTime] = useState({ minute: 0, second: 0 });
  const [won, setWon] = useState(false);
  
  useEffect (() => {
    let interval = null;
    if(timerOn) {
      interval = setInterval(() => {
        setTime(prev => {
          return {
            second: prev.second === 59 ? 0 : prev.second + 1,
            minute: prev.second === 59 ? prev.minute + 1 : prev.minute
          }
        })
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
    
  },[timerOn]);
  
  useEffect(() => {
    if(won) {
      setTimerOn(false);
    }
  },[won])
  
  const runStart = () => {
    setStart(true);
    setTimerOn(true);
  }
  
  function flipCard(index,e) {
    
    if(start && !won) {    
      if(activeCards.length === 0) {
        setActiveCards([index]);
      }
      if(activeCards.length === 1) {
        const firstIndex = activeCards[0];
        const secondIndex = index;
        
        if(cards[firstIndex] === cards[secondIndex]) {

          if(foundPairs.length + 2 === cards.length) {
            setWon(true);
          }
          
          setFoundPairs([...foundPairs, firstIndex, secondIndex])
        }
        
        setActiveCards([...activeCards, index]);
      }
      if(activeCards.length === 2) {
        setActiveCards([index]);
      }
      
      setClicks(clicks + 1);
    }
  }
  
  const reloadHandler = () => {
    setCards(shuffle([...Images, ...Images]));
    setActiveCards([]);
    setFoundPairs([]);
    setClicks(0);
    setStart(false);
    setWon(false);
    setTime({ minute: 0, second: 0 });
  }
  
  return (
    <div className='wrapper'>
      <div className='board'>
        {cards.map((card, index) => {
          const flippedToFront = (activeCards.indexOf(index) !== -1) || foundPairs.indexOf(index) !== -1;        
          return (
              <div key={index} className={'card-outer' + (flippedToFront ? " flipped" : '')} onClick={() => flipCard(index)}>
                <div className='card'>
                  <div className="front">
                    <img src={card} alt=""/>
                  </div>
                  <div className="back"></div>
                </div>
              </div>
          )
        })}
      </div>
      <div className={'stats' + (start ? " visible" : '')}>
        clicks: {clicks} &nbsp;&nbsp; Found pairs: {foundPairs.length / 2}
      </div>
      
      {won && (<div>You won the game! Congratulations!<br/></div>)}
      
      <button className={"btn" + (!start ? " visible" : '')} onClick={runStart}>Start</button>
      
      <div className={'icon' + (start ? " visible" : '')} onClick={reloadHandler}>
        <svg viewBox="0 0 119.4 122.88"><path d="M83.91,26.34a43.78,43.78,0,0,0-22.68-7,42,42,0,0,0-24.42,7,49.94,49.94,0,0,0-7.46,6.09,42.07,42.07,0,0,0-5.47,54.1A49,49,0,0,0,30,94a41.83,41.83,0,0,0,18.6,10.9,42.77,42.77,0,0,0,21.77.13,47.18,47.18,0,0,0,19.2-9.62,38,38,0,0,0,11.14-16,36.8,36.8,0,0,0,1.64-6.18,38.36,38.36,0,0,0,.61-6.69,8.24,8.24,0,1,1,16.47,0,55.24,55.24,0,0,1-.8,9.53A54.77,54.77,0,0,1,100.26,108a63.62,63.62,0,0,1-25.92,13.1,59.09,59.09,0,0,1-30.1-.25,58.45,58.45,0,0,1-26-15.17,65.94,65.94,0,0,1-8.1-9.86,58.56,58.56,0,0,1,7.54-75,65.68,65.68,0,0,1,9.92-8.09A58.38,58.38,0,0,1,61.55,2.88,60.51,60.51,0,0,1,94.05,13.3l-.47-4.11A8.25,8.25,0,1,1,110,7.32l2.64,22.77h0a8.24,8.24,0,0,1-6.73,9L82.53,43.31a8.23,8.23,0,1,1-2.9-16.21l4.28-.76Z"/></svg>
      </div>
      
      <div className={'timer' + (start ? " visible" : '')}>
        <div>{time.minute <= 9 ? `0${time.minute}`: time.minute}</div> 
        <span>:</span>
        <div>{time.second <= 9 ? `0${time.second}`: time.second}</div> 
      </div>
    </div>
  );
}

export default App;
