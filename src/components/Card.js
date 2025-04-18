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