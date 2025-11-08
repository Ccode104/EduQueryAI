import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  return (
    <div className="space-y-4 max-w-3xl p-4">
      <ChatMessage
        role="user"
        content="What is the time complexity of QuickSort?"
      />
      <ChatMessage
        role="assistant"
        content="QuickSort has an average time complexity of O(n log n) and a worst-case time complexity of O(n²). The worst case occurs when the pivot selection consistently results in unbalanced partitions."
        sources={["DSA Notes - Ch 4", "Algorithm Book - p.156"]}
        onSourceClick={(source) => console.log('Source clicked:', source)}
      />
    </div>
  );
}
