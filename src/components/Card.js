import {Card as MantineCard, Text, Stack} from "@mantine/core"

export default function Card({suit, value}){
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
                <Text size="lg" weight={700}>{value}</Text>
                <Text size="md">{suit}</Text>
            </Stack>
        </MantineCard>
    );
}