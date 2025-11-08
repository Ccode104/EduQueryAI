import { Badge } from "@/components/ui/badge";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  onSourceClick?: (source: string) => void;
}

export default function ChatMessage({
  role,
  content,
  sources = [],
  onSourceClick,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="shrink-0 rounded-full bg-primary p-2">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[80%]`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
          data-testid={`message-${role}`}
        >
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
        {!isUser && sources.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {sources.map((source, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs cursor-pointer hover-elevate"
                onClick={() => onSourceClick?.(source)}
                data-testid={`source-${idx}`}
              >
                {source}
              </Badge>
            ))}
          </div>
        )}
      </div>
      {isUser && (
        <div className="shrink-0 rounded-full bg-secondary p-2">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}
