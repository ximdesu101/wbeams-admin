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
import {
    LaptopMinimalCheck,
    Mail,
    CardSim,
    Save,
} from "lucide-react"

const SiteSetting = () => {
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Site Setting</CardTitle>
            </CardHeader>

            <Separator />

            <CardContent>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Site Name</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="site-name"
                                type="text"
                                placeholder="Wbeams-SJC"
                            />
                            <InputGroupAddon>
                                <LaptopMinimalCheck />
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>

                    <FieldGroup className="grid grid-cols-2">
                        <Field>
                            <FieldLabel>Site Email</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="site-email"
                                    type="email"
                                    placeholder="Wbeams@gmail.com"
                                />
                                <InputGroupAddon>
                                    <Mail />
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>

                        <Field>
                            <FieldLabel>Site Contact Number</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="site-contact-number"
                                    type="tel"
                                    placeholder="09123456789"
                                />
                                <InputGroupAddon>
                                    <CardSim />
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                    </FieldGroup>
                </FieldGroup>
            </CardContent>

            <CardFooter>
                <Button type="submit">
                    <Save className="h-4 w-4" />
                    Save Site Setting
                </Button>
            </CardFooter>
        </Card>
    )
}

export default SiteSetting