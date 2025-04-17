import { useState, useEffect } from "react";
import { createDeck } from "./utils/deck";
import Hand from "./components/Hand.js"
import Controls from "./components/Controls.js";
import { calculateScore } from "./utils/calculateScore.js";


function App(){
  const [deck, setDeck]=useState([]);
  const [playerHand, setPlayerHand]=useState([]);
  const [dealerHand, setDealerHand]=useState([]);
  const [message, setMessage]=useState("");
  const [gameOver, setGameOver]=useState(false);

  useEffect(()=>{
    const newDeck=createDeck();
    setPlayerHand([newDeck[0], newDeck[2]]);
    setDealerHand([newDeck[1], newDeck[3]]);
    setDeck(newDeck.slice(4));
  }, [])

  const handleHit=()=>{
    if (deck.length === 0) return;

    const card=deck[0];
    const newHand=[...playerHand, card];
    const newDeck=deck.slice(1);
    const newScore=calculateScore(newHand);

    setPlayerHand(newHand);
    setDeck(newDeck);
    
    if (newScore>21){
      setMessage("Bursted... You Lose...");
      setGameOver(true);
    }
  }

  const handleStand=()=>{
    let newDeck=[...deck];
    let newDealerHand=[...dealerHand];

    while (calculateScore(newDealerHand)<17){
      const card=newDeck.shift();
      newDealerHand.push(card);
    }
    
    setDealerHand(newDealerHand);
    setDeck(newDeck);

    const playerScore=calculateScore(playerHand);
    const dealerScore=calculateScore(newDealerHand);
    
    if (dealerScore>21){
      setMessage("Dealer Bursted! You Win!");
    } else if (playerScore>dealerScore){
      setMessage("You Win!");
    } else if (playerScore<dealerScore){
      setMessage("You Lose...")
    } else {
      setMessage("Draw!")
    }

    setGameOver(true)
  }

  const handleRestart=()=>{
    const newDeck=createDeck();
    setPlayerHand([newDeck[0], newDeck[2]]);
    setDealerHand([newDeck[1], newDeck[3]]);
    setDeck(newDeck.slice(4));
    setMessage("");
    setGameOver(false);
  }

  const playerScore=calculateScore(playerHand);
  const dealerScore=calculateScore(dealerHand);

  return (
    <div style={{padding: "20px"}}>
      <h1>Black Jack</h1>
      <Hand cards={dealerHand} title={`Dealer (Score: ${dealerScore})`} />
      <Hand cards={playerHand} title={`Player (Score: ${playerScore})`} />
      <Controls onHit={handleHit} onStand={handleStand} disabled={gameOver} />
      
      {message && (
        <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
          {message}
        </div>
      )}
      
      {gameOver && (
        <button onClick={handleRestart} style={{marginTop: "20px"}}>
          Play Again
        </button>
      )}
    </div>
  );
}

export default App