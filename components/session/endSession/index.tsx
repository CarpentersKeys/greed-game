import { Box, Button } from "@mantine/core";
import useEndSesssion from "./hooks/useEndSession";

export default function EndSessionButton() {
    const endSession = useEndSesssion();

    return <Box><Button onClick={() => endSession()}>End Session</Button></Box>
}