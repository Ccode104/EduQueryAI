import EmptyState from '../EmptyState';
import { BookOpen } from 'lucide-react';

export default function EmptyStateExample() {
  return (
    <EmptyState
      icon={BookOpen}
      title="No documents yet"
      description="Upload your course materials to get started with AI-powered assistance"
      actionLabel="Upload Document"
      onAction={() => console.log('Upload clicked')}
    />
  );
}
