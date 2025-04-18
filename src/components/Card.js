import {Card as MantineCard, Text, Stack} from "@mantine/core"

export default function Card({suit, value, colorScheme}){
    const textColor = colorScheme === "dark" ? "#111" : "#111";
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
                <Text size="lg" weight={700} style={{color: textColor}}>{value}</Text>
                <Text size="md" style={{color: textColor}}>{suit}</Text>
            </Stack>
        </MantineCard>
    );
}