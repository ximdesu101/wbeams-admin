import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Empty } from "@/components/ui/empty";
import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle
} from "@/components/ui/field";
import {
    Upload,
    Eye,
    X,
    Download
} from "lucide-react";
import { importMasterlist } from "@/services/masterlistService"; 

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const Bulk = ({ onChange, onSuccess }) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [templateType, setTemplateType] = useState("student");
    const queryClient = useQueryClient();

    const importMutation = useMutation({
        mutationFn: (file) => importMasterlist(file),
        onSuccess: (result) => {
            if (result.imported_count > 0) {
                toast.success(`${result.imported_count} user(s) imported successfully.`);
            }
            if (result.failed_rows?.length > 0) {
                toast.warning(
                    `${result.failed_rows.length} row(s) failed to import. Check the details below.`
                );
            }
            queryClient.invalidateQueries({ queryKey: ["masterlist"] });
            setFiles([]);
            onChange?.([]);
            onSuccess?.(result);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Something went wrong during import.");
        },
    });

    const handleDownloadTemplate = () => {
        const path =
            templateType === "student"
                ? "/templates/student_template.xlsx"
                : "/templates/faculty_staff_template.xlsx";
        const link = document.createElement("a");
        link.href = path;
        link.download = path.split("/").pop();
        link.click();
    };

    const addFiles = useCallback(
        (newFiles) => {
            if (!newFiles?.length) return;

            const file = newFiles[0];
            const extension = "." + file.name.split(".").pop().toLowerCase();

            if (![".xlsx", ".xls"].includes(extension)) {
                toast.warning("Only Excel (.xlsx and .xls) files are allowed.");
                return;
            }

            setFiles([file]);
            onChange?.([file]);
        },
        [onChange]
    );

    const removeFile = (index) => {
        const updated = files.filter((_, i) => i !== index);
        setFiles(updated);
        onChange?.(updated);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const handleImport = () => {
        if (!files.length) {
            toast.warning("Please select a file to import.");
            return;
        }
        importMutation.mutate(files[0]);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    User Masterlist Bulk Upload
                </CardTitle>
                <CardDescription>
                    Upload an Excel file to import users at once.
                </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
                <div className="flex flex-col gap-5 w-full max-w-md">
                    {/* Dropzone */}
                    <Empty
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={cn(
                            "border transition-colors p-7",
                            isDragging
                                ? "border-muted-foreground bg-muted"
                                : "border-border bg-background"
                        )}
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
                            <Upload className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="text-center">
                            <p className="text-base font-semibold text-foreground">Upload excel files</p>
                            <p className="text-sm text-muted-foreground">Drag and drop or browse to select a file.</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => document.getElementById("file-input").click()}
                            disabled={importMutation.isPending}
                        >
                            Browse files
                        </Button>
                        <input
                            id="file-input"
                            type="file"
                            accept=".xlsx,.xls"
                            className="hidden"
                            onChange={(e) => addFiles(e.target.files)}
                            disabled={importMutation.isPending}
                        />
                    </Empty>
                    {/* File list */}
                    {files.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {files.map((file, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatSize(file.size)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                            onClick={() => window.open(URL.createObjectURL(file))}
                                            disabled={importMutation.isPending}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                            onClick={() => removeFile(i)}
                                            disabled={importMutation.isPending}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="justify-end mt-auto">
                <CardAction className="flex gap-1">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" className="hover:underline" disabled={importMutation.isPending}>
                                Need help with the format?
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-md">
                            <AlertDialogHeader className="space-y-2">
                                <AlertDialogTitle className="flex items-center gap-2">
                                    <Download className="h-5 w-5" />
                                    Download Import Template
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Choose the template that matches the type of users you want to import.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Separator />
                            <RadioGroup value={templateType} onValueChange={setTemplateType} className="max-w-sm">
                                <FieldLabel htmlFor="student-select">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>Student</FieldTitle>
                                            <FieldDescription>
                                                Template for importing student.
                                            </FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem value="student" id="student-select" />
                                    </Field>
                                </FieldLabel>
                                <FieldLabel htmlFor="faculty-select">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>Faculty & Staff</FieldTitle>
                                            <FieldDescription>
                                                Template for importing faculty and staff.
                                            </FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem value="faculty" id="faculty-select" />
                                    </Field>
                                </FieldLabel>
                            </RadioGroup>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction className="gap-2" onClick={handleDownloadTemplate}>
                                    <Download className="h-4 w-4" />
                                        Download Template
                                    </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button className="gap-1" onClick={handleImport} disabled={importMutation.isPending || !files.length}>
                        {importMutation.isPending ? (
                            <>
                                <Spinner />
                                Importing...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5 my-auto" />
                                Import File
                            </>
                        )}
                    </Button>
                </CardAction>
            </CardFooter>
        </Card >
    )
}

export default Bulk