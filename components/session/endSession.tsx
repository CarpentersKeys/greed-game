import { Box, Button } from "@mantine/core";

interface INameEntryProps {
    endSession: () => void;
}
export default function EndSessionButton({ endSession }: INameEntryProps) {
    return <Box><Button onClick={() => endSession()}>End Session</Button></Box>
}