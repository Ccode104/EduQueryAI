import { useState } from "react";
import DocumentUploadZone from "@/components/DocumentUploadZone";
import DocumentListItem from "@/components/DocumentListItem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import EmptyState from "@/components/EmptyState";
import { Upload as UploadIcon } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  type: "notes" | "pyq" | "book";
  size: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
  course: string;
}

export default function Upload() {
  const { toast } = useToast();
  const [documentType, setDocumentType] = useState<"notes" | "pyq" | "book">("notes");
  const [courseName, setCourseName] = useState("");

  const { data: documents = [] } = useQuery<UploadedFile[]>({
    queryKey: ["/api/documents"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("course", courseName || "Uncategorized");
      formData.append("type", documentType);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Upload successful",
        description: "Your document is being processed",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document deleted",
      });
    },
  });

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (!courseName) {
      toast({
        title: "Course name required",
        description: "Please enter a course name before uploading",
        variant: "destructive",
      });
      return;
    }

    selectedFiles.forEach((file) => {
      uploadMutation.mutate(file);
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Upload Documents</h1>
        <p className="text-muted-foreground">
          Upload your course materials for AI-powered assistance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Document Settings</CardTitle>
              <CardDescription>
                Configure the document type and course before uploading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course-name">Course Name</Label>
                <Input
                  id="course-name"
                  placeholder="e.g., Data Structures & Algorithms"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  data-testid="input-course-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-type">Document Type</Label>
                <Select
                  value={documentType}
                  onValueChange={(value: "notes" | "pyq" | "book") => setDocumentType(value)}
                >
                  <SelectTrigger id="doc-type" data-testid="select-doc-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notes">Handwritten Notes</SelectItem>
                    <SelectItem value="pyq">Scanned PYQs</SelectItem>
                    <SelectItem value="book">Course Book</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <DocumentUploadZone onFilesSelected={handleFilesSelected} />
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Files</CardTitle>
              <CardDescription>
                {documents.length} {documents.length === 1 ? "file" : "files"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {documents.map((file: any) => (
                    <DocumentListItem
                      key={file.id}
                      name={file.name}
                      type={file.type}
                      size={`${(file.fileSize / 1024 / 1024).toFixed(1)} MB`}
                      status={file.processingStatus}
                      onDelete={() => handleDelete(file.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={UploadIcon}
                  title="No files uploaded"
                  description="Upload files to see them here"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
