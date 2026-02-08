import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UseFormRegisterReturn } from "react-hook-form"

export function RoleRadioGroup({ register }: { register: UseFormRegisterReturn<any> }) {
    return (
        <RadioGroup defaultValue="member" className="w-fit">
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
                    <FieldLabel htmlFor="desc-r2">Trainer</FieldLabel>
                    <FieldDescription>View member metrics, see upcoming trainer sessions</FieldDescription>
                </FieldContent>
            </Field>
            <Field orientation="horizontal">
                <RadioGroupItem value="admin" id="desc-r3" />
                <FieldContent>
                    <FieldLabel htmlFor="desc-r3">Admin</FieldLabel>
                    <FieldDescription>
                        Create sessions, assign rooms
                    </FieldDescription>
                </FieldContent>
            </Field>
        </RadioGroup>
    )
}
