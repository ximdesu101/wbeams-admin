import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from "@/components/ui/input-group"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Timer, Ban, Save } from "lucide-react"

const SessionSetting = () => {
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Session Security Setting</CardTitle>
            </CardHeader>

            <Separator />

            <CardContent>
                <FieldGroup>
                    <FieldGroup className="grid grid-cols-2">
                        <Field>
                            <FieldLabel>Session Timeout</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="session-timeout"
                                    type="number"
                                />
                                <InputGroupAddon>
                                    <Timer />
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>

                        <Field>
                            <FieldLabel>Max Login Attempt</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="max-login-attempt"
                                    type="number"
                                />
                                <InputGroupAddon>
                                    <Ban />
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                    </FieldGroup>

                    <FieldGroup className="grid grid-cols-2">
                        <Field>
                            <FieldLabel>Current Session Timeout</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="current-session-timeout"
                                    type="number"
                                    readOnly
                                />
                            </InputGroup>
                        </Field>

                        <Field>
                            <FieldLabel>Current Max Login Attempt</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="current-max-login-attempt"
                                    type="number"
                                    readOnly
                                />
                            </InputGroup>
                        </Field>
                    </FieldGroup>
                </FieldGroup>
            </CardContent>

            <CardFooter>
                <Button type="submit">
                    <Save className="h-4 w-4" />
                    Save Session Setting
                </Button>
            </CardFooter>
        </Card>
    )
}

export default SessionSetting