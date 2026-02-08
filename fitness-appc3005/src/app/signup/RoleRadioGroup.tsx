import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Control, Controller } from "react-hook-form"

export function RoleRadioGroup({ control }: { control: Control<any> }) {
    return (
        // Control is the form control from react-hook-form
        // Necessary for third-party controlled components
        <Controller
            name="role"
            control={control}
            render={({ field }) => (
                <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-fit"
                >
                    <Field orientation="horizontal">
                        <RadioGroupItem value="member" id="desc-r1" />
                        <FieldContent>
                            <FieldLabel htmlFor="desc-r1">Member</FieldLabel>
                            <FieldDescription>
                                Update metrics/personal details, book classes, write goals
                            </FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field orientation="horizontal">
                        <RadioGroupItem value="trainer" id="desc-r2" />
                        <FieldContent>
                            <FieldLabel htmlFor="desc-r2">Member + Trainer</FieldLabel>
                            <FieldDescription>View member metrics, see upcoming trainer sessions</FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field orientation="horizontal">
                        <RadioGroupItem value="admin" id="desc-r3" />
                        <FieldContent>
                            <FieldLabel htmlFor="desc-r3">Member + Admin</FieldLabel>
                            <FieldDescription>
                                Create sessions, assign rooms
                            </FieldDescription>
                        </FieldContent>
                    </Field>
                </RadioGroup>
            )}
        />
    )
}
