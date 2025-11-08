import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocumentReferenceProps {
  name: string;
  type: "notes" | "pyq" | "book";
  excerpt: string;
  page?: number;
  onClick?: () => void;
}

const typeLabels = {
  notes: "Notes",
  pyq: "PYQ",
  book: "Book",
};

export default function DocumentReference({
  name,
  type,
  excerpt,
  page,
  onClick,
}: DocumentReferenceProps) {
  return (
    <Card
      className="cursor-pointer hover-elevate active-elevate-2"
      onClick={onClick}
      data-testid={`doc-ref-${name}`}
    >
      <CardHeader className="pb-3 space-y-0">
        <div className="flex items-start gap-2 mb-1">
          <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm truncate">{name}</CardTitle>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {typeLabels[type]}
          </Badge>
          {page && (
            <span className="text-xs text-muted-foreground">Page {page}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xs line-clamp-3">
          {excerpt}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
