import { type User, type InsertUser, type Document, type InsertDocument, type Conversation, type InsertConversation, type Message, type InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface DocumentChunk {
  id: string;
  documentId: string;
  text: string;
  embedding: number[];
  page?: number;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createDocument(document: InsertDocument): Promise<Document>;
  getDocument(id: string): Promise<Document | undefined>;
  getDocumentsByCourse(course: string): Promise<Document[]>;
  getAllDocuments(): Promise<Document[]>;
  updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<boolean>;
  
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  
  storeDocumentChunk(chunk: Omit<DocumentChunk, 'id'>): Promise<DocumentChunk>;
  getChunksByDocument(documentId: string): Promise<DocumentChunk[]>;
  searchSimilarChunks(embedding: number[], limit: number, course?: string): Promise<DocumentChunk[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private documents: Map<string, Document>;
  private conversations: Map<string, Conversation>;
  private messages: Map<string, Message>;
  private chunks: Map<string, DocumentChunk>;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.chunks = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      id,
      ...insertDocument,
      extractedText: insertDocument.extractedText ?? null,
      uploadedAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByCourse(course: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.course === course
    );
  }

  async getAllDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    const doc = this.documents.get(id);
    if (!doc) return undefined;
    
    const updated = { ...doc, ...updates };
    this.documents.set(id, updated);
    return updated;
  }

  async deleteDocument(id: string): Promise<boolean> {
    // Also delete associated chunks
    const chunks = await this.getChunksByDocument(id);
    chunks.forEach(chunk => this.chunks.delete(chunk.id));
    
    return this.documents.delete(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      id,
      course: insertConversation.course ?? null,
      createdAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getAllConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      id,
      ...insertMessage,
      sources: insertMessage.sources ?? null,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((msg) => msg.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async storeDocumentChunk(chunk: Omit<DocumentChunk, 'id'>): Promise<DocumentChunk> {
    const id = randomUUID();
    const fullChunk: DocumentChunk = { id, ...chunk };
    this.chunks.set(id, fullChunk);
    return fullChunk;
  }

  async getChunksByDocument(documentId: string): Promise<DocumentChunk[]> {
    return Array.from(this.chunks.values()).filter(
      (chunk) => chunk.documentId === documentId
    );
  }

  async searchSimilarChunks(embedding: number[], limit: number, course?: string): Promise<DocumentChunk[]> {
    const allChunks = Array.from(this.chunks.values());
    
    // Filter by course if specified
    let filteredChunks = allChunks;
    if (course) {
      const courseDocIds = Array.from(this.documents.values())
        .filter(doc => doc.course === course)
        .map(doc => doc.id);
      filteredChunks = allChunks.filter(chunk => courseDocIds.includes(chunk.documentId));
    }

    // Calculate cosine similarity
    const chunksWithScores = filteredChunks.map(chunk => ({
      chunk,
      score: this.cosineSimilarity(embedding, chunk.embedding),
    }));

    // Sort by score and return top results
    return chunksWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.chunk);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

export const storage = new MemStorage();
