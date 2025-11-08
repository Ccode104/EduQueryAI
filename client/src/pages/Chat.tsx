import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import DocumentReference from "@/components/DocumentReference";
import EmptyState from "@/components/EmptyState";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// TODO: remove mock data
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const mockReferences = [
  {
    name: "DSA Notes - Chapter 4",
    type: "notes" as const,
    excerpt: "QuickSort is a divide-and-conquer algorithm that works by selecting a pivot element and partitioning the array around it. The algorithm recursively sorts the sub-arrays.",
    page: 23,
  },
  {
    name: "Algorithms Textbook",
    type: "book" as const,
    excerpt: "The average case time complexity analysis of QuickSort shows that it performs O(n log n) comparisons on average, making it one of the most efficient sorting algorithms.",
    page: 156,
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (content: string) => {
    console.log("Message sent:", content);
    
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
    };

    setMessages([...messages, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `${Date.now()}-ai`,
        role: "assistant",
        content: "QuickSort has an average time complexity of O(n log n) and a worst-case time complexity of O(n²). The worst case occurs when the pivot selection consistently results in unbalanced partitions. However, with good pivot selection strategies like choosing the median-of-three, the algorithm performs very well in practice.",
        sources: ["DSA Notes - Ch 4", "Algorithm Book - p.156"],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6">
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold mb-2">AI Chat</h1>
          <p className="text-muted-foreground">
            Ask questions about your course materials
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
                      sources={message.sources}
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
              {messages.length > 0 ? (
                <div className="space-y-3">
                  {mockReferences.map((ref, idx) => (
                    <DocumentReference
                      key={idx}
                      name={ref.name}
                      type={ref.type}
                      excerpt={ref.excerpt}
                      page={ref.page}
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
