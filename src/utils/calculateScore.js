export function calculateScore(hand){
    let score=0;
    let aceCount=0;

    for (let card of hand){
        if (["J", "Q", "K"].includes(card.value)){
            score+=10;
        } else if (card.value==="A"){
            aceCount+=1;
            score+=11;
        } else {
            score+=parseInt(card.value);
        }
    }

    while (score>21 && aceCount>0){
        score-=10;
        aceCount-=1;
    }

    return score;
}