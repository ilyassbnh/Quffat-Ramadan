"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Upload, FileText, Loader2 } from "lucide-react"
import { uploadFile } from "@/actions/vector-action"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Define form data type (although React Hook Form handles FileList native)
interface FormData {
    file: FileList
}

export function KnowledgeUpload() {
    const [open, setOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<FormData>()

    // Watch for file selection to show preview filename
    const selectedFile = watch("file")?.[0]

    const onSubmit = async (data: FormData) => {
        const file = data.file[0]
        if (!file) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const result = await uploadFile(formData)

            if (result.success) {
                toast({
                    title: "Succès",
                    description: "Document indexé avec succès",
                    className: "bg-casa-emerald text-white border-casa-emerald",
                })
                setOpen(false)
                reset()
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: result.error || "Une erreur est survenue lors de l'indexation.",
                })
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error instanceof Error ? error.message : "Une erreur inattendue est survenue.",
            })
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-casa-emerald hover:bg-casa-emerald/90 text-white gap-2 shrink-0" size="sm">
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">Ajouter un document</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Indexation de documents</DialogTitle>
                    <DialogDescription>
                        Importez un fichier PDF ou CSV pour enrichir la base de connaissances de l'IA.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                    <div className="relative">
                        <input
                            {...register("file", {
                                required: "Un document est requis",
                                validate: {
                                    fileType: (files) => {
                                        const type = files[0]?.type
                                        return (
                                            ["application/pdf", "text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(type) ||
                                            "Format non supporté (PDF, CSV ou XLSX)"
                                        )
                                    },
                                    fileSize: (files) => {
                                        return (
                                            files[0]?.size <= 5 * 1024 * 1024 ||
                                            "La taille du fichier ne doit pas dépasser 5 Mo"
                                        )
                                    },
                                },
                            })}
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.csv,.xlsx,.xls"
                            disabled={isUploading}
                        />

                        <label
                            htmlFor="file-upload"
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                                // Specific requirement: dashed border color casa-emerald
                                "border-casa-emerald/50 hover:border-casa-emerald hover:bg-casa-emerald/5",
                                errors.file ? "border-red-500 bg-red-50 hover:bg-red-50" : ""
                            )}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                {selectedFile ? (
                                    <div className="flex items-center gap-2 text-casa-emerald font-medium">
                                        <FileText className="h-8 w-8" />
                                        <p className="text-sm truncate max-w-[200px]">{selectedFile.name}</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 mb-3 text-casa-emerald/60" />
                                        <p className="mb-1 text-sm text-gray-500">
                                            <span className="font-semibold text-casa-emerald">Cliquez pour upload</span> ou glissez-déposez
                                        </p>
                                        <p className="text-xs text-gray-400">PDF, CSV, XLSX (MAX. 5MB)</p>
                                    </>
                                )}
                            </div>
                        </label>
                        {errors.file && (
                            <p className="text-sm text-red-500 mt-2">{errors.file.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false)
                                reset()
                            }}
                            disabled={isUploading}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="bg-casa-emerald hover:bg-casa-emerald/90 text-white lg:w-fit w-full"
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Indexation...
                                </>
                            ) : (
                                "Indexer le document"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
