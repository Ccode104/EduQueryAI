import DocumentReference from '../DocumentReference';

export default function DocumentReferenceExample() {
  return (
    <div className="max-w-sm space-y-4">
      <DocumentReference
        name="DSA Notes - Chapter 4"
        type="notes"
        excerpt="QuickSort is a divide-and-conquer algorithm that works by selecting a pivot element and partitioning the array around it..."
        page={23}
        onClick={() => console.log('Document clicked')}
      />
      <DocumentReference
        name="Algorithms Textbook"
        type="book"
        excerpt="The average case time complexity analysis of QuickSort shows that it performs O(n log n) comparisons..."
        page={156}
        onClick={() => console.log('Document clicked')}
      />
    </div>
  );
}
