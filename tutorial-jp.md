# Reactでブラックジャックを作ろう！

この記事では，[React](https://ja.react.dev/)を使用して[ブラックジャック](https://ja.wikipedia.org/wiki/%E3%83%96%E3%83%A9%E3%83%83%E3%82%AF%E3%82%B8%E3%83%A3%E3%83%83%E3%82%AF)を実装していきます．
UIにはモダンなライブラリである[Mantine](https://mantine.dev/)を利用します．

> 実際のコードは[Githubで公開](https://github.com/Hiromu-USHIHARA/ReactBlackJack.git)していますので，適宜ご参照ください．

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

まず，`utils/deck.js`で，52枚のカードデッキを生成し，シャッフルする機能を実装します．
デッキは４種のスートと13種の数からなります．

```javascript: src/utils/deck.js
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

ブラックジャックの核心となるスコア計算ロジックを`utils/calculateScore.js`に実装します．
この実装では以下のルールに従います:

- エースの柔軟な扱い（1点または11点）
- 絵札（J，Q，K）は10点として計算
- バースト（21点超過）の判定


```javascript: src/utils/calculateScore.js
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
カードを表示するコンポーネントを実装します．
このコンポーネントは以下の責務を持ちます:

- 単一のカードの視覚的表現
- スートと数字の表示
- カードのスタイリング（色，サイズ，レイアウト）
- ダークモード/ライトモードへの対応


```javascript: src/components/Card.js
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
`Card.js`で実装したカードを使って，プレイヤーとディーラーの手札を表示するコンポーネントを実装します．
このコンポーネントは以下の責務を持ちます:

- 複数のカードの表示と管理
- 手札のスコア表示
- カードのレイアウト制御
- ゲーム状態の視覚的表現


```javascript: src/components/Hand.js
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
ゲームの操作インターフェースを提供するコンポーネントを実装します．
このコンポーネントは以下の責務を持ちます:

- ゲーム操作ボタンの提供
- ゲーム状態に応じたUI制御
- ユーザーアクションのトリガー
- 無効な操作の防止


```javascript: src/components/Controls.js
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
テーマ切り替え機能を提供するコンポーネントの実装について説明します．
このコンポーネントは以下の責務を持ちます：

- ライトモード/ダークモードの切り替え
- テーマ状態の管理
- ユーザー設定の永続化
- 視覚的フィードバックの提供


```javascript: src/components/ColorSchemeToggle.js
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
このコンポーネントは以下の責務を持ちます：

- ゲームの状態管理
- ゲームロジックの制御
- ユーザーインタラクションの処理
- 勝敗判定の実行

実装の特徴：
- React Hooksを活用した状態管理
- コンポーネントの適切な分割
- エラーハンドリング
- パフォーマンス最適化

```javascript: src/App.js
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

## 完成したゲームの遊び方

プロジェクトをローカルで実行するには以下のコマンドを実行します:

```bash
npm start
```

以下のルールで進行します:

1. ゲーム開始時に，プレイヤーとディーラーに2枚ずつカードが配られます
2. プレイヤーは「Hit」ボタンでカードを追加で引くことができます
3. スコアが21を超えるとバースト（負け）となります
4. 「Stand」ボタンを押すと，ディーラーが17以上になるまでカードを引き続けます
5. ディーラーとプレイヤーのスコアを比較して勝敗が決まります
6. 「Play Again」ボタンで新しいゲームを開始できます


## デプロイ済みのゲーム画面

以下が完成したゲームの画面です．
このゲームは[Vercelにデプロイ](https://react-black-jack-git-main-hiromu-ushiharas-projects.vercel.app/)されており，オンラインでプレイすることができます．

![](https://storage.googleapis.com/zenn-user-upload/810c4cd45515-20250526.png)

> この記事の作成にあたっては，作成したコードをもとに生成AIが活用されています．
