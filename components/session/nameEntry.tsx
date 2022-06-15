import { TextInput, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

interface INameEntryProps {
    nameSubmissionSet: (name: string) => void;
}
export default function NameEntry({ nameSubmissionSet }: INameEntryProps) {
    const form = useForm({
        initialValues: {
            name: '',
        },

        validate: {
            name: (val) => (val.length > 3 ? null : 'User a longer name'),
        },
    });
    // destructuring types https://flaviocopes.com/typescript-object-destructuring/
    function handleSubmitPlayer({ name }: { name: string }): void {
        nameSubmissionSet(name);
    }
    return (
        <>
            <form onSubmit={form.onSubmit(handleSubmitPlayer)}>
                <TextInput
                    required
                    label='Name'
                    placeholder='your name for this match'
                    {...form.getInputProps('name')} // interesting pattern, returns value, onChange and error
                >
                </TextInput>
                {/* <Checkbox
              mt="md"
              label='Automatch'
              {...form.getInputProps('autoMatch', { type: 'checkbox' })}
              required
            /> */}
                <Group position="right" mt="md">
                    <Button type="submit">Find Match</Button>
                </Group>
            </form>
        </>
    )
}