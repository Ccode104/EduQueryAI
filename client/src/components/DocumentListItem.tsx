import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DocumentListItemProps {
  name: string;
  type: "notes" | "pyq" | "book";
  size: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
  onDelete?: () => void;
}

const typeLabels = {
  notes: "Notes",
  pyq: "PYQ",
  book: "Course Book",
};

const typeColors = {
  notes: "default",
  pyq: "secondary",
  book: "outline",
} as const;

export default function DocumentListItem({
  name,
  type,
  size,
  status,
  progress = 0,
  onDelete,
}: DocumentListItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg" data-testid={`doc-item-${name}`}>
      <div className="rounded-lg bg-muted p-2">
        <FileText className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{name}</h4>
            <p className="text-xs text-muted-foreground">{size}</p>
          </div>
          <Badge variant={typeColors[type]} className="shrink-0">
            {typeLabels[type]}
          </Badge>
        </div>
        {status === "processing" && (
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Processing OCR... {progress}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        )}
        {status === "completed" && (
          <div className="flex items-center gap-1 mt-1">
            <CheckCircle2 className="h-3 w-3 text-green-600" />
            <span className="text-xs text-muted-foreground">Ready</span>
          </div>
        )}
        {status === "failed" && (
          <div className="flex items-center gap-1 mt-1">
            <XCircle className="h-3 w-3 text-destructive" />
            <span className="text-xs text-destructive">Processing failed</span>
          </div>
        )}
      </div>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          data-testid={`button-delete-${name}`}
          className="shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
