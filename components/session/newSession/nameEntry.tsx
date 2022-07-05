import { TextInput, Group, Button } from "@mantine/core";
import { useState } from "react";

export default function NameEntry({ submitNewPlayer }: { submitNewPlayer: (name: string) => void }) {

    const [name, nameSet] = useState('');
    const [errorMessage, errorMessageSet] = useState<string | null>(null);

    function handleSubmitPlayer(e: React.SyntheticEvent) {
        e.preventDefault();
        const isValid = (name.length > 3 ? true : null)
        if (isValid && submitNewPlayer) {
            submitNewPlayer(name);
            errorMessageSet(null);
        } else {
            errorMessageSet('use a longer name')
        }
    }
    return (
        <>
            <form onSubmit={handleSubmitPlayer}>
                <TextInput
                    required
                    label='Name'
                    error={errorMessage}
                    placeholder='your name for this match'
                    value={name}
                    onChange={e => nameSet(e.target.value)}
                >
                </TextInput>
                <Group position="right" mt="md">
                    <Button type="submit">Find Match</Button>
                </Group>
            </form>
        </>
    )
}