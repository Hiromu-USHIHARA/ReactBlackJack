# Reactでブラックジャックを作ろう！

このチュートリアルでは，Reactを使用してブラックジャックゲームを実装していきます．モダンなUIライブラリであるMantineを使用し，コンポーネントベースの設計で，クリーンで保守性の高いコードを書いていきましょう．


## プロジェクトのセットアップ

まず，Create React Appを使用して新しいプロジェクトを作成します：

```bash
npx create-react-app react-blackjack
cd react-blackjack
```

## 必要なパッケージのインストール

このプロジェクトでは以下のパッケージを使用します：

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

まず，`utils/deck.js`でカードデッキの生成ロジックを実装します：

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

`utils/calculateScore.js`でブラックジャックのスコア計算ロジックを実装します：

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
カードを表示するコンポーネントです：

```javascript
import { Paper, Text } from '@mantine/core';

function Card({ card, colorScheme }) {
  const isRed = card.suit === '♥' || card.suit === '♦';
  
  return (
    <Paper
      p="xs"
      radius="md"
      style={{
        width: '60px',
        height: '90px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorScheme === 'dark' ? '#2C2E33' : 'white',
        border: '1px solid #ddd'
      }}
    >
      <Text
        size="xl"
        weight={700}
        color={isRed ? 'red' : 'black'}
      >
        {card.value}
      </Text>
      <Text
        size="xl"
        color={isRed ? 'red' : 'black'}
      >
        {card.suit}
      </Text>
    </Paper>
  );
}

export default Card;
```

#### Hand.js
プレイヤーやディーラーの手札を表示するコンポーネントです：

```javascript
import { Stack, Text } from '@mantine/core';
import Card from './Card';

function Hand({ cards, title, colorScheme }) {
  return (
    <Stack align="center" spacing="xs">
      <Text weight={500}>{title}</Text>
      <div style={{ display: 'flex', gap: '8px' }}>
        {cards.map((card, index) => (
          <Card key={index} card={card} colorScheme={colorScheme} />
        ))}
      </div>
    </Stack>
  );
}

export default Hand;
```

#### Controls.js
ゲームの操作ボタンを表示するコンポーネントです：

```javascript
import { Group, Button } from '@mantine/core';

function Controls({ onHit, onStand, disabled }) {
  return (
    <Group position="center" spacing="md">
      <Button onClick={onHit} disabled={disabled}>
        Hit
      </Button>
      <Button onClick={onStand} disabled={disabled}>
        Stand
      </Button>
    </Group>
  );
}

export default Controls;
```

### メインゲームロジックの実装

`App.js`でメインのゲームロジックを実装します．主な機能は：

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

function App() {
  // ゲームの状態管理
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  // ゲーム開始時の初期化
  useEffect(() => {
    const newDeck = createDeck();
    setPlayerHand([newDeck[0], newDeck[2]]);
    setDealerHand([newDeck[1], newDeck[3]]);
    setDeck(newDeck.slice(4));
  }, []);

  // ヒット（カードを引く）機能
  const handleHit = () => {
    if (deck.length === 0) return;

    const card = deck[0];
    const newHand = [...playerHand, card];
    const newDeck = deck.slice(1);
    const newScore = calculateScore(newHand);

    setPlayerHand(newHand);
    setDeck(newDeck);
    
    if (newScore > 21) {
      setMessage("Bursted... You Lose...");
      setGameOver(true);
    }
  };

  // スタンド（カードを引くのをやめる）機能
  const handleStand = () => {
    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];

    // ディーラーが17以上になるまでカードを引く
    while (calculateScore(newDealerHand) < 17) {
      const card = newDeck.shift();
      newDealerHand.push(card);
    }
    
    setDealerHand(newDealerHand);
    setDeck(newDeck);

    // 勝敗判定
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(newDealerHand);
    
    if (dealerScore > 21) {
      setMessage("Dealer Bursted! You Win!");
    } else if (playerScore > dealerScore) {
      setMessage("You Win!");
    } else if (playerScore < dealerScore) {
      setMessage("You Lose...");
    } else {
      setMessage("Draw!");
    }

    setGameOver(true);
  };

  // ゲームのリスタート機能
  const handleRestart = () => {
    const newDeck = createDeck();
    setPlayerHand([newDeck[0], newDeck[2]]);
    setDealerHand([newDeck[1], newDeck[3]]);
    setDeck(newDeck.slice(4));
    setMessage("");
    setGameOver(false);
  };

  // 現在のスコアを計算
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  return (
    <Container size="sm" mt="md">
      <Stack align="center" spacing="md">
        <Group position="apart" align="center" px="md" pt="md">
          <Title order={1}>Black Jack</Title>
          <ColorSchemeToggle />
        </Group>
        <Hand cards={dealerHand} title={`Dealer (Score: ${dealerScore})`} colorScheme={colorScheme} />
        <Hand cards={playerHand} title={`Player (Score: ${playerScore})`} colorScheme={colorScheme} />
        
        {/* ゲーム中の操作ボタン */}
        {!gameOver && (
          <Controls onHit={handleHit} onStand={handleStand} disabled={gameOver} />
        )}

        {/* ゲーム終了時のリスタートボタン */}
        {gameOver && (
          <Button onClick={handleRestart} mt="md" color="gray" variant="outline">
            Play Again
          </Button>
        )}
        
        {/* 結果メッセージ */}
        {message && (
          <Alert
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

export default App;
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

## 技術的なポイント

1. **React Hooks**: `useState`と`useEffect`を使用して状態管理を行っています
2. **コンポーネント設計**: 機能ごとにコンポーネントを分割し，再利用性を高めています
3. **Mantine**: モダンなUIコンポーネントライブラリを使用して，見やすいインターフェースを実現しています
4. **ダークモード対応**: `ColorSchemeToggle`コンポーネントでダークモード/ライトモードの切り替えが可能です

このチュートリアルに沿って実装することで，Reactの基本的な概念を学びながら，実用的なブラックジャックゲームを作成することができます．
