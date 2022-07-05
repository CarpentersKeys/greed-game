import { TextInput, Box, Button, Group } from "@mantine/core";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { EGameStage } from "../../../models/game/types";
import useUpdateGame from "../../shared/hooks/game/useUpdateGame";

const TIME_ENTRY_ERROR_MESSAGE = 'hmmm, somethings not right, enter a time between 0 and 30'
export default function TimerSet({ loadingSet }: { loadingSet: Dispatch<SetStateAction<boolean>> }): JSX.Element {
    const { updateGame, updateLoading } = useUpdateGame();
    const [time, timeSet] = useState<number>(0);
    const [entryError, entryErrorSet] = useState<string | null>(null);

    const handleSubmitPlayer = useCallback((e: React.SyntheticEvent) => {
        e.preventDefault();
        const isValid = (time < 30 && time > 0 ? true : false)
        if (isValid && updateGame) {
            updateGame({ gameStage: EGameStage.TIMER_RUN, timeSet: time });
            entryErrorSet(null);
        } else {
            entryErrorSet(TIME_ENTRY_ERROR_MESSAGE)
        }
    }, [time, updateGame])

    useEffect(() => {
        loadingSet(updateLoading)
        return () => loadingSet(false);
    }, [updateLoading, loadingSet])

    return (
        <Box>
            Set a timer to wait, the longer you wait to more points you get. !But the Greedy player can steal!
            <form onSubmit={handleSubmitPlayer}>
                <TextInput
                    type='number'
                    required
                    label='Time'
                    error={entryError}
                    placeholder='seconds to wait'
                    value={time}
                    onChange={(e) => timeSet(Number(e.target.value))}
                >
                </TextInput>
                <Button onClick={() => timeSet((prev: number) => Math.min(Number(prev) + 5, 30))}>+5</Button>
                <Button onClick={() => timeSet((prev: number) => Math.min(Number(prev) - 5, 30))}>+5</Button>
                <Group position="right" mt="md">
                    <Button type="submit">Find Match</Button>
                </Group>
            </form>
        </Box >
    )
}