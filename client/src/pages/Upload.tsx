import { useState } from "react";
import DocumentUploadZone from "@/components/DocumentUploadZone";
import DocumentListItem from "@/components/DocumentListItem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { Upload as UploadIcon } from "lucide-react";

// TODO: remove mock data
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
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [documentType, setDocumentType] = useState<"notes" | "pyq" | "book">("notes");
  const [courseName, setCourseName] = useState("");

  const handleFilesSelected = (selectedFiles: File[]) => {
    console.log("Files selected:", selectedFiles);
    
    const newFiles: UploadedFile[] = selectedFiles.map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: file.name,
      type: documentType,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      status: "processing",
      progress: 0,
      course: courseName || "Uncategorized",
    }));

    setFiles([...files, ...newFiles]);

    // Simulate processing
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, progress } : f
          )
        );
        if (progress >= 100) {
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, status: "completed" } : f
            )
          );
        }
      }, 500);
    });
  };

  const handleDelete = (id: string) => {
    console.log("Delete file:", id);
    setFiles(files.filter((f) => f.id !== id));
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
                {files.length} {files.length === 1 ? "file" : "files"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {files.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {files.map((file) => (
                    <DocumentListItem
                      key={file.id}
                      name={file.name}
                      type={file.type}
                      size={file.size}
                      status={file.status}
                      progress={file.progress}
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
