// Simple text chunking and embedding utilities

export function chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
  const chunks: string[] = [];
  const words = text.split(/\s+/);
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim());
    }
  }
  
  return chunks;
}

// Simple hash-based embedding for demonstration
// In production, this would use a proper embedding model
export function generateSimpleEmbedding(text: string): number[] {
  const dim = 384; // Common embedding dimension
  const embedding = new Array(dim).fill(0);
  
  // Use character codes and positions to create a pseudo-embedding
  const normalized = text.toLowerCase();
  for (let i = 0; i < normalized.length; i++) {
    const charCode = normalized.charCodeAt(i);
    const idx = (charCode * (i + 1)) % dim;
    embedding[idx] += 1;
  }
  
  // Normalize the vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
}

export function extractKeywords(text: string): string[] {
  // Simple keyword extraction - remove common words and return unique terms
  const commonWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'as', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'should', 'could', 'may', 'might', 'must', 'can', 'of', 'to', 'in',
    'for', 'with', 'and', 'or', 'but', 'not', 'from', 'by', 'this', 'that',
  ]);
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));
  
  return Array.from(new Set(words)).slice(0, 20);
}
