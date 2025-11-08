import { useCallback, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
}

export default function DocumentUploadZone({ onFilesSelected }: DocumentUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? "border-primary bg-accent" : "border-border"
      }`}
      data-testid="upload-zone"
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-muted p-4">
          {isDragging ? (
            <FileText className="h-8 w-8 text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div>
          <h3 className="text-base font-semibold mb-1">
            {isDragging ? "Drop files here" : "Upload course materials"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop PDF files or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports handwritten notes, scanned PYQs, and digital course books
          </p>
        </div>
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="application/pdf"
            multiple
            onChange={handleFileInput}
          />
          <Button asChild data-testid="button-browse-files">
            <label htmlFor="file-upload" className="cursor-pointer">
              Browse Files
            </label>
          </Button>
        </div>
      </div>
    </div>
  );
}
