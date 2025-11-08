import { useState } from "react";
import CourseCard from "@/components/CourseCard";
import EmptyState from "@/components/EmptyState";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

// TODO: remove mock data
const mockCourses = [
  {
    id: "1",
    name: "Data Structures & Algorithms",
    code: "CS201",
    documentCount: 12,
    lastUpdated: "2 days ago",
  },
  {
    id: "2",
    name: "Operating Systems",
    code: "CS301",
    documentCount: 8,
    lastUpdated: "5 days ago",
  },
  {
    id: "3",
    name: "Database Management Systems",
    code: "CS202",
    documentCount: 15,
    lastUpdated: "1 week ago",
  },
  {
    id: "4",
    name: "Computer Networks",
    code: "CS302",
    documentCount: 6,
    lastUpdated: "3 days ago",
  },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = mockCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your courses and study materials
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-courses"
        />
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              name={course.name}
              code={course.code}
              documentCount={course.documentCount}
              lastUpdated={course.lastUpdated}
              onAsk={() => {
                console.log("Ask AI for", course.code);
                setLocation("/chat");
              }}
              onViewDocs={() => {
                console.log("View docs for", course.code);
                setLocation("/documents");
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description="Try adjusting your search query or upload documents to get started"
          actionLabel="Upload Documents"
          onAction={() => setLocation("/upload")}
        />
      )}
    </div>
  );
}
