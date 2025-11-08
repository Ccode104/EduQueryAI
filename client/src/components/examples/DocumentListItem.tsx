import DocumentListItem from '../DocumentListItem';

export default function DocumentListItemExample() {
  return (
    <div className="space-y-4 max-w-2xl">
      <DocumentListItem
        name="Data Structures Notes - Chapter 3.pdf"
        type="notes"
        size="2.4 MB"
        status="completed"
        onDelete={() => console.log('Delete clicked')}
      />
      <DocumentListItem
        name="DSA PYQ 2023.pdf"
        type="pyq"
        size="1.8 MB"
        status="processing"
        progress={67}
        onDelete={() => console.log('Delete clicked')}
      />
      <DocumentListItem
        name="Algorithm Design Manual.pdf"
        type="book"
        size="15.2 MB"
        status="failed"
        onDelete={() => console.log('Delete clicked')}
      />
    </div>
  );
}
