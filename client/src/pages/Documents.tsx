import { useState, useEffect } from "react";
import DocumentListItem from "@/components/DocumentListItem";
import EmptyState from "@/components/EmptyState";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Documents() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Get course filter from URL if present
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const courseFilter = searchParams.get("course");

  const { data: documents = [] } = useQuery<any[]>({
    queryKey: ["/api/documents"],
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

  const filteredDocuments = documents.filter((doc: any) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || doc.type === activeTab;
    const matchesCourse = !courseFilter || doc.course === courseFilter;
    return matchesSearch && matchesTab && matchesCourse;
  });

  useEffect(() => {
    if (courseFilter) {
      setSearchQuery(courseFilter);
    }
  }, [courseFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">My Documents</h1>
        <p className="text-muted-foreground">
          {courseFilter
            ? `Documents for ${courseFilter}`
            : "Manage all your uploaded course materials"}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-documents"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">
            All Documents
          </TabsTrigger>
          <TabsTrigger value="notes" data-testid="tab-notes">
            Notes
          </TabsTrigger>
          <TabsTrigger value="pyq" data-testid="tab-pyq">
            PYQs
          </TabsTrigger>
          <TabsTrigger value="book" data-testid="tab-books">
            Books
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredDocuments.map((doc: any) => (
                <DocumentListItem
                  key={doc.id}
                  name={doc.name}
                  type={doc.type}
                  size={`${(doc.fileSize / 1024 / 1024).toFixed(1)} MB`}
                  status={doc.processingStatus}
                  onDelete={() => deleteMutation.mutate(doc.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No documents found"
              description="Try adjusting your search or upload new documents"
              actionLabel="Upload Documents"
              onAction={() => setLocation("/upload")}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
