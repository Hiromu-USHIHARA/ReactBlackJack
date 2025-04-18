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