import Card from "./Card"
import {Group, Title} from "@mantine/core"

export default function Hand({cards, title}){
    return (
        <div style={{marginBottom: "20px"}}>
            <Title order={4} align="center">{title}</Title>
            <Group spacing="xs">
                {cards.map((card, index) => (
                    <Card key={index} suit={card.suit} value={card.value} />
                ))}
            </Group>
        </div>
    );
}