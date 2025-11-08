import { useState } from "react";
import CourseCard from "@/components/CourseCard";
import EmptyState from "@/components/EmptyState";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface CourseStats {
  course: string;
  documentCount: number;
  lastUpdated: string;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: documents = [] } = useQuery({
    queryKey: ["/api/documents"],
  });

  // Aggregate documents by course
  const courseStats = documents.reduce((acc: Map<string, CourseStats>, doc: any) => {
    if (!acc.has(doc.course)) {
      acc.set(doc.course, {
        course: doc.course,
        documentCount: 0,
        lastUpdated: doc.uploadedAt,
      });
    }
    const stats = acc.get(doc.course)!;
    stats.documentCount++;
    if (new Date(doc.uploadedAt) > new Date(stats.lastUpdated)) {
      stats.lastUpdated = doc.uploadedAt;
    }
    return acc;
  }, new Map());

  const courses = Array.from(courseStats.values()).map((stats) => ({
    ...stats,
    lastUpdated: new Date(stats.lastUpdated).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  const filteredCourses = courses.filter((course) =>
    course.course.toLowerCase().includes(searchQuery.toLowerCase())
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
              key={course.course}
              name={course.course}
              code={course.course}
              documentCount={course.documentCount}
              lastUpdated={course.lastUpdated}
              onAsk={() => {
                setLocation(`/chat?course=${encodeURIComponent(course.course)}`);
              }}
              onViewDocs={() => {
                setLocation(`/documents?course=${encodeURIComponent(course.course)}`);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title={searchQuery ? "No courses found" : "No documents uploaded yet"}
          description={
            searchQuery
              ? "Try adjusting your search query"
              : "Upload your course materials to get started with AI-powered assistance"
          }
          actionLabel="Upload Documents"
          onAction={() => setLocation("/upload")}
        />
      )}
    </div>
  );
}
