import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogContent,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Field,
    FieldGroup,
    FieldError,
} from "@/components/ui/field";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { approveAccessRequest } from "@/services/accessRequest";

const ApproveAccessRequestDialog = ({ open, onOpenChange, accessRequest, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [role, setRole] = useState("student");
    const [studentProgram, setStudentProgram] = useState("");
    const [studentYear, setStudentYear] = useState("");

    const handleRoleChange = (value) => {
        setRole(value);
        if (value !== "student") {
            setStudentProgram("");
            setStudentYear("");
        }
    };

    const handleApprove = async () => {
        setFieldErrors({});
        setLoading(true);
        try {
            await approveAccessRequest(accessRequest.id, {
                role,
                student_program: role === "student" ? studentProgram : null,
                student_year: role === "student" ? studentYear : null,
            });
            toast.success(`${accessRequest.first_name} ${accessRequest.last_name} added to the masterlist.`);
            onOpenChange(false);
            onSuccess?.();
        } catch (err) {
            const errors = err.response?.data?.errors;
            if (errors) {
                const mapped = {};
                Object.entries(errors).forEach(([key, messages]) => {
                    mapped[key] = messages[0];
                });
                setFieldErrors(mapped);
            } else {
                toast.error(err.response?.data?.message || "Failed to approve request.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Approve Access Request</DialogTitle>
                    <DialogDescription>
                        Confirm the role for <span className="font-medium text-foreground">
                            {accessRequest?.first_name} {accessRequest?.last_name}
                        </span> ({accessRequest?.id_number}) before adding them to the masterlist.
                    </DialogDescription>
                </DialogHeader>
                <Separator className="my-3" />
                <FieldGroup>
                    <Field data-invalid={!!fieldErrors.role}>
                        <Label>Select Role</Label>
                        <div className="rounded-md border border-border bg-secondary px-3 py-2">
                            <RadioGroup value={role} onValueChange={handleRoleChange} className="flex justify-between">
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="student" id="approve-student" disabled={loading} />
                                    <Label htmlFor="approve-student">Student</Label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="faculty" id="approve-faculty" disabled={loading} />
                                    <Label htmlFor="approve-faculty">Faculty</Label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="staff" id="approve-staff" disabled={loading} />
                                    <Label htmlFor="approve-staff">Staff</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <FieldError errors={fieldErrors.role ? [{ message: fieldErrors.role }] : undefined} />
                    </Field>
                    {role === "student" && (
                        <FieldGroup className="grid grid-cols-2">
                            <Field data-invalid={!!fieldErrors.student_program}>
                                <Label>Program</Label>
                                <Select value={studentProgram} onValueChange={setStudentProgram} disabled={loading}>
                                    <SelectTrigger aria-invalid={!!fieldErrors.student_program}>
                                        <SelectValue placeholder="Select Program" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectGroup>
                                            <SelectItem value="BSIT">BSIT</SelectItem>
                                            <SelectItem value="BSCrim">BSCrim</SelectItem>
                                            <SelectItem value="BEED">BEED</SelectItem>
                                            <SelectItem value="BTLED">BTLED</SelectItem>
                                            <SelectItem value="BSABE">BSABE</SelectItem>
                                            <SelectItem value="BSA">BSA</SelectItem>
                                            <SelectItem value="BSF">BSF</SelectItem>
                                            <SelectItem value="BAT">BAT</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FieldError errors={fieldErrors.student_program ? [{ message: fieldErrors.student_program }] : undefined} />
                            </Field>
                            <Field data-invalid={!!fieldErrors.student_year}>
                                <Label>Year</Label>
                                <Select value={studentYear} onValueChange={setStudentYear} disabled={loading}>
                                    <SelectTrigger aria-invalid={!!fieldErrors.student_year}>
                                        <SelectValue placeholder="Select Year" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectGroup>
                                            <SelectItem value="1st year">1st Year</SelectItem>
                                            <SelectItem value="2nd year">2nd Year</SelectItem>
                                            <SelectItem value="3rd year">3rd Year</SelectItem>
                                            <SelectItem value="4th year">4th Year</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FieldError errors={fieldErrors.student_year ? [{ message: fieldErrors.student_year }] : undefined} />
                            </Field>
                        </FieldGroup>
                    )}
                </FieldGroup>
                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleApprove} disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner /> Approving...
                            </>
                        ) : (
                            "Approve & Add to Masterlist"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ApproveAccessRequestDialog;