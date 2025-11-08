import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import DocumentReference from "@/components/DocumentReference";
import EmptyState from "@/components/EmptyState";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[] | null;
}

export default function Chat() {
  const [location] = useLocation();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get course filter from URL if present
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const courseFilter = searchParams.get("course");

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/conversations", conversationId, "messages"],
    enabled: !!conversationId,
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["/api/documents"],
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/conversations", {
        course: courseFilter,
      });
    },
    onSuccess: (data: any) => {
      setConversationId(data.id);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) return null;
      return apiRequest("POST", `/api/conversations/${conversationId}/messages`, {
        content,
        course: courseFilter,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/conversations", conversationId, "messages"],
      });
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
    },
  });

  useEffect(() => {
    if (!conversationId) {
      createConversationMutation.mutate();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (content: string) => {
    setIsTyping(true);
    sendMessageMutation.mutate(content);
  };

  // Get referenced documents from messages
  const referencedDocs = messages
    .flatMap((m) => m.sources || [])
    .filter((source, idx, arr) => arr.indexOf(source) === idx)
    .map((sourceName) => {
      const doc = documents.find((d: any) => d.name === sourceName);
      return doc
        ? {
            name: doc.name,
            type: doc.type,
            excerpt: doc.extractedText?.substring(0, 200) || "Processing...",
          }
        : null;
    })
    .filter(Boolean);

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6">
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold mb-2">AI Chat</h1>
          <p className="text-muted-foreground">
            {courseFilter
              ? `Ask questions about ${courseFilter}`
              : "Ask questions about your course materials"}
          </p>
        </div>

        <Card className="flex-1 flex flex-col min-h-0">
          <CardContent className="flex-1 flex flex-col p-6 min-h-0">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState
                  icon={MessageSquare}
                  title="Start a conversation"
                  description="Ask any question about your uploaded course materials and get instant AI-powered assistance"
                />
              </div>
            ) : (
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      sources={message.sources || []}
                      onSourceClick={(source) => console.log("Source clicked:", source)}
                    />
                  ))}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <div className="flex gap-1">
                        <span className="animate-bounce">●</span>
                        <span className="animate-bounce [animation-delay:0.2s]">●</span>
                        <span className="animate-bounce [animation-delay:0.4s]">●</span>
                      </div>
                      <span>AI is thinking...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            )}
            <div className="mt-4">
              <ChatInput onSend={handleSend} disabled={isTyping} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-80 shrink-0">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="text-base">Related Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[calc(100vh-12rem)]">
              {referencedDocs.length > 0 ? (
                <div className="space-y-3">
                  {referencedDocs.map((ref: any, idx) => (
                    <DocumentReference
                      key={idx}
                      name={ref.name}
                      type={ref.type}
                      excerpt={ref.excerpt}
                      onClick={() => console.log("Document clicked:", ref.name)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Referenced documents will appear here
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
