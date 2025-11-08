import CourseCard from '../CourseCard';

export default function CourseCardExample() {
  return (
    <div className="max-w-sm">
      <CourseCard
        name="Data Structures & Algorithms"
        code="CS201"
        documentCount={12}
        lastUpdated="2 days ago"
        onAsk={() => console.log('Ask AI clicked')}
        onViewDocs={() => console.log('View docs clicked')}
      />
    </div>
  );
}
