import { useState } from "react";
import DocumentListItem from "@/components/DocumentListItem";
import EmptyState from "@/components/EmptyState";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";

// TODO: remove mock data
const mockDocuments = [
  {
    id: "1",
    name: "DSA Notes - Chapter 1-3.pdf",
    type: "notes" as const,
    size: "2.4 MB",
    status: "completed" as const,
    course: "CS201",
  },
  {
    id: "2",
    name: "DSA PYQ 2023.pdf",
    type: "pyq" as const,
    size: "1.8 MB",
    status: "completed" as const,
    course: "CS201",
  },
  {
    id: "3",
    name: "Operating Systems Concepts.pdf",
    type: "book" as const,
    size: "15.2 MB",
    status: "completed" as const,
    course: "CS301",
  },
  {
    id: "4",
    name: "OS PYQ 2022-2023.pdf",
    type: "pyq" as const,
    size: "3.1 MB",
    status: "completed" as const,
    course: "CS301",
  },
  {
    id: "5",
    name: "Database Notes - Normalization.pdf",
    type: "notes" as const,
    size: "1.9 MB",
    status: "completed" as const,
    course: "CS202",
  },
];

export default function Documents() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || doc.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">My Documents</h1>
        <p className="text-muted-foreground">
          Manage all your uploaded course materials
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
          <TabsTrigger value="all" data-testid="tab-all">All Documents</TabsTrigger>
          <TabsTrigger value="notes" data-testid="tab-notes">Notes</TabsTrigger>
          <TabsTrigger value="pyq" data-testid="tab-pyq">PYQs</TabsTrigger>
          <TabsTrigger value="book" data-testid="tab-books">Books</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredDocuments.map((doc) => (
                <DocumentListItem
                  key={doc.id}
                  name={doc.name}
                  type={doc.type}
                  size={doc.size}
                  status={doc.status}
                  onDelete={() => console.log("Delete", doc.id)}
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
