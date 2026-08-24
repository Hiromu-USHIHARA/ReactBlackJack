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