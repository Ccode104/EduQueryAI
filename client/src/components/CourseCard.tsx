import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare } from "lucide-react";

interface CourseCardProps {
  name: string;
  code: string;
  documentCount: number;
  lastUpdated: string;
  onAsk?: () => void;
  onViewDocs?: () => void;
}

export default function CourseCard({
  name,
  code,
  documentCount,
  lastUpdated,
  onAsk,
  onViewDocs,
}: CourseCardProps) {
  return (
    <Card className="hover-elevate">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="text-xs mt-1">{code}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {documentCount} docs
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          Updated {lastUpdated}
        </p>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={onAsk}
            data-testid={`button-ask-${code}`}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Ask AI
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onViewDocs}
            data-testid={`button-view-docs-${code}`}
          >
            <FileText className="h-4 w-4 mr-2" />
            View Docs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
