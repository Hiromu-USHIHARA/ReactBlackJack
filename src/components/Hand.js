import Card from "./Card"

export default function Hand({cards, title}){
    return (
        <div>
            <h3>{title}</h3>
            <div>
                {cards.map((card, index) => (
                    <Card key={index} suit={card.suit} value={card.value} />
                ))}
            </div>
        </div>
    );
}