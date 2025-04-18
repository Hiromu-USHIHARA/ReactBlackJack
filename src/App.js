import { useState, useEffect } from "react";
import { createDeck } from "./utils/deck";
import Hand from "./components/Hand.js"
import Controls from "./components/Controls.js";
import ColorSchemeToggle from "./components/ColorSchemeToggle.js";
import { calculateScore } from "./utils/calculateScore.js";
import { Container, Title, Stack, Button, Alert, Text, Group, useMantineColorScheme } from "@mantine/core";

function App(){
  const [deck, setDeck]=useState([]);
  const [playerHand, setPlayerHand]=useState([]);
  const [dealerHand, setDealerHand]=useState([]);
  const [message, setMessage]=useState("");
  const [gameOver, setGameOver]=useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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
    <Container size="sm" mt="md">
      <Stack align="center" spacing="md">
        <Group position="apart" align="center" px="md" pt="md">
          <Title order={1}>Black Jack</Title>
          <ColorSchemeToggle />
        </Group>
          <Hand cards={dealerHand} title={`Dealer (Score: ${dealerScore})`} colorScheme={colorScheme} />
          <Hand cards={playerHand} title={`Player (Score: ${playerScore})`} colorScheme={colorScheme} />
          {!gameOver && (
            <Controls onHit={handleHit} onStand={handleStand} disabled={gameOver} />
          )}

          {gameOver && (
            <Button onClick={handleRestart} mt="md" color="gray" variant="outline">
              Play Again
            </Button>
          )}
          
          {message && (
            <Alert
              // title="Result"
              color={message.includes("Win") ? "green" : message.includes("Lose") ? "red" : "yellow"}
              variant="light"
              radius="md"
              withCloseButton={false}
            >
              <Text size="lg" weight={600}>
                {message}
              </Text>
            </Alert>
          )}
      </Stack>
    </Container>
  );
}

export default App