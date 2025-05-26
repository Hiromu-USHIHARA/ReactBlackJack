# Reactでブラックジャックを作ろう！

このチュートリアルでは，[React](https://ja.react.dev/)を使用して[ブラックジャック](https://ja.wikipedia.org/wiki/%E3%83%96%E3%83%A9%E3%83%83%E3%82%AF%E3%82%B8%E3%83%A3%E3%83%83%E3%82%AF)を実装していきます．
UIにはモダンなライブラリである[Mantine](https://mantine.dev/)を利用します．

## プロジェクトのセットアップ

まずReactのプロジェクトを初期化します:

```bash
npx create-react-app react-blackjack
cd react-blackjack
```

## 必要なパッケージのインストール

このプロジェクトでは以下のパッケージを使用します:

```bash
npm install @mantine/core @mantine/hooks @emotion/react
```

## プロジェクト構造

プロジェクトは以下のような構造になっています：

```
src/
  ├── components/
  │   ├── Card.js
  │   ├── Controls.js
  │   ├── Hand.js
  │   └── ColorSchemeToggle.js
  ├── utils/
  │   ├── deck.js
  │   └── calculateScore.js
  ├── App.js
  └── index.js
```

## 実装の詳細

### カードとデッキの実装

まず，`utils/deck.js`でカードデッキの生成ロジックを実装します．
デッキは４種のスートと13種の数の組み合わせからなります．

```javascript
export function createDeck(){
    const suits=["♣", "♠", "♥", "♦"];
    const values=[
        "A","2","3","4","5","6",
        "7","8","9","10","J","Q","K"
    ];
    let deck=[];
    for (let suit of suits){
        for (let value of values){
            deck.push({suit, value});
        }
    }

    return shuffle(deck);
}

function shuffle(deck){
    return deck.sort(()=>Math.random()-0.5)
}
```

### スコア計算の実装

次に`utils/calculateScore.js`にブラックジャックのスコア計算ロジックを実装します．
エースはスコアが21を超えない場合は11として，超える場合は1として加算されます．

```javascript
export const calculateScore = (hand) => {
  let score = 0;
  let aces = 0;

  for (let card of hand) {
    if (card.value === 'A') {
      aces += 1;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  }

  // エースの処理
  for (let i = 0; i < aces; i++) {
    if (score + 11 <= 21) {
      score += 11;
    } else {
      score += 1;
    }
  }

  return score;
};
```

### コンポーネントの実装

#### Card.js
カードを表示するコンポーネントです．

```javascript
import {Card as MantineCard, Text, Stack} from "@mantine/core"

export default function Card({suit, value, colorScheme}){
    const textColor = colorScheme === "dark" ? "#111" : "#111";
    const suitColor = suit === "♥" || suit === "♦" ? "red" : textColor;
    return (
        <MantineCard
            shadow="sm"
            padding="xs"
            radius="md"
            withBorder
            style={{
                width: 60,
                height: 80,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                textAlign: "center",
                margin: "5px"
            }}
        >
            <Stack spacing={0} align="center">
                <Text size="xl" weight={700} style={{color: suitColor, fontFamily: "serif"}}>{value}</Text>
                <Text size="xl" style={{color: suitColor}}>{suit}</Text>
            </Stack>
        </MantineCard>
    );
}
```

#### Hand.js
`Card.js`で実装したカードを使って，プレイヤーとディーラーの手札を表示します．

```javascript
import Card from "./Card"
import { Group, Title} from "@mantine/core"

export default function Hand({cards, title, colorScheme}){
    return (
        <div style={{marginBottom: "20px"}}>
            <Title order={4} align="center">{title}</Title>
            <Group spacing="xs" position="center" wrap="wrap">
                {cards.map((card, index) => (
                    <Card key={index} suit={card.suit} value={card.value} colorScheme={colorScheme} />
                ))}
            </Group>
        </div>
    );
}
```

#### Controls.js
ゲームを操作するボタンを実装します．
プレイヤーが行う操作はヒット（カードを引く），スタンド（勝負する）の２つです．

```javascript
import { Button, Group } from "@mantine/core"

export default function Controls({onHit, onStand, disabled}){
    return (
        <Group mt="md">
            <Button onClick={onHit} disabled={disabled} color="blue" size="md" radius="md">
                Hit
            </Button>
            <Button onClick={onStand} disabled={disabled} color="red" size="md" radius="md">
                Stand
            </Button>
        </Group>
    );
}
```

#### ColorSchemeToggle.js

この機能はオプショナルですが，ライトモード/ダークモード切り換え機能を実装しています．

```javascript
import { ActionIcon, useMantineColorScheme, Tooltip } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";

export default function ColorSchemeToggle(){
    const {colorScheme, toggleColorScheme}=useMantineColorScheme();
    const dark = colorScheme==="dark";

    return (
        <Tooltip label="Toggle color scheme" withArrow position="left">
            <ActionIcon
                variant="outline"
                color={dark ? "yellow" : "blue"}
                onClick={()=>toggleColorScheme()}
                title="Toggle color scheme"
                size="lg"
                radius="md"
            >
                {dark ? <IconSun size="1rem" /> : <IconMoonStars size="1rem" />}
            </ActionIcon>
        </Tooltip>
    );
}
```

### メインゲームロジックの実装

`App.js`でメインのゲームロジックを実装します．
主な機能は以下のとおりです．

1. ゲームの状態管理（デッキ，プレイヤーの手札，ディーラーの手札）
2. ヒット（カードを引く）機能
3. スタンド（カードを引くのをやめる）機能
4. ゲームの勝敗判定
5. ゲームのリスタート機能

以下が`App.js`の実装です：

```javascript
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
```

この`App.js`の実装では，以下の重要なポイントがあります：

1. **状態管理**：
   - `useState`フックを使用して，デッキ，プレイヤーの手札，ディーラーの手札，メッセージ，ゲーム終了状態を管理します．
   - `useMantineColorScheme`フックでダークモード/ライトモードの切り替えを管理します．

2. **ゲーム初期化**：
   - `useEffect`フックを使用して，コンポーネントのマウント時にゲームを初期化します．
   - 新しいデッキを作成し，プレイヤーとディーラーに2枚ずつカードを配ります．

3. **ゲームロジック**：
   - `handleHit`：プレイヤーがカードを引く処理を実装します．
   - `handleStand`：プレイヤーがスタンドした後のディーラーの行動と勝敗判定を実装します．
   - `handleRestart`：ゲームをリスタートする処理を実装します．

4. **UIレンダリング**：
   - Mantineのコンポーネントを使用して，モダンでレスポンシブなUIを実現します．
   - ゲームの状態に応じて，適切なUIコンポーネントを表示します．

## 完成したゲームの遊び方

1. ゲーム開始時に，プレイヤーとディーラーに2枚ずつカードが配られます
2. プレイヤーは「Hit」ボタンでカードを追加で引くことができます
3. 「Stand」ボタンを押すと，ディーラーが17以上になるまでカードを引き続けます
4. スコアが21を超えるとバースト（負け）となります
5. ディーラーとプレイヤーのスコアを比較して勝敗が決まります
6. 「Play Again」ボタンで新しいゲームを開始できます
